"use server"

import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { StripeState } from '@/types/actions';

// 教材と違う箇。
// stripとのセッション作成に成功した場合は、このアクション内でリダイレクトを実施する。（Nexe.jsの標準的な考え方）
// エラー時だけ、clientコンポーネントに返す
export async function createStripeSession(prevState: StripeState, formData: FormData) : Promise<StripeState> {

  const priceId = formData.get('priceId') as string;

  // clerkのユーザー
  const user = await currentUser();

  if(!user) {
    throw new Error("認証が必要です")
  }

  let checkoutUrl: string | null = null;

  try {

    // ユーザーテーブルのstripe_customer_idにユーザーIDがない場合、stripe側に該当ユーザーがいないことを示すのでstripe側にユーザーを作成しにいく。
    // 本来はStripe側にもチェックはいりそう。。。
    const dbUser = await prisma.user.findUnique({
      where: {ClerkId: user.id}
    })

    let stripeCustomerId = dbUser?.stripCustomerId;

    if(!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
        metadata: {
          clerkId: user.id
        },
      })

      // 上記の処理が完了したら、ユーザーをアップデートする
      await prisma.user.update({
        where: { ClerkId: user.id},
        data : {
          stripCustomerId: customer.id
        }
      })
      stripeCustomerId = customer.id
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.BASE_URL}/dashboard/plan?cancel=true`, //サンプルコードにはないけど、やっておいた方がよいので実装
      // checkout用sessionにもmetadataを付与しとかないと、clerkIdによる更新ができない。
      metadata: {
        clerkId: user.id
      }
    });

    checkoutUrl = session.url;

    if(!session.url) {
      throw new Error("セッションの作成に失敗しました")
    }

    // return {
    //   status: "success",
    //   error: "",
    //   redirectUrl: session.url
    // }

  } catch (err) {
    return {
      status: "error",
      error: "決済処理中にエラーが発生しました",
      redirectUrl: ""
    }
  }

  if (checkoutUrl) {
    redirect(checkoutUrl);
  }

  // redirectが呼ばれなかった場合のフォールバック（理論上は到達しない）
  return {
    status: "idle",
    error: "",
    redirectUrl: ""
  };
}

