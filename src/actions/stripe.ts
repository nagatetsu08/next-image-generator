"use server"

import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// 教材と違う箇。
// stripとのセッション作成に成功した場合は、このアクション内でリダイレクトを実施する。（Nexe.jsの標準的な考え方）
// エラー時だけ、clientコンポーネントに返す
export async function createStripeSession(prevState, formData) {

  const priceId = formData.get('priceId') as string;

  const user = await currentUser();

  if(!user) {
    throw new Error("認証が必要です")
  }

  let checkoutUrl: string | null = null;

  try {

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
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
}


