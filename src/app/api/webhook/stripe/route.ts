import { plans } from "@/config/plans";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";



export async function POST(request: Request) {
  let event;
  const body = await request.text()
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = request.headers.get("stripe-signature") as string;

  if (!endpointSecret || !signature) {
    console.error("Webhook Error: Missing secret or signature");
    return new NextResponse("Webhook configuration error", { status: 400 });
  }

  const priceIdMap: Record<string, string> = Object.fromEntries(
    plans.map(plan => [plan.name, plan.priceId])
  );
    
  try {
      event = stripe.webhooks.constructEvent(
          body,
          signature,
          endpointSecret
      )

      if(!event) {
        return new NextResponse("No Webhook event", {status: 500})
      }


      switch(event.type){
        case "checkout.session.completed":
          const session = event.data.object

          if (!session.metadata || !session.subscription) {
            return new NextResponse("session Error", {status: 500})
          }

          const subscription = await stripe.subscriptions.retrieve(
            session.subscription.toString()
          ) as Stripe.Subscription

          let subscriptionStatus:SubscriptionStatus = "FREE"

          switch(subscription.items.data[0].price.id) {
            case priceIdMap.Starter:
              subscriptionStatus = "STARTER"
              break;
            case priceIdMap.Pro:
              subscriptionStatus = "PRO"
              break;
            case priceIdMap.Enterprise:
              subscriptionStatus = "ENTERPRISE"
              break;
          }

          // 初回はsubscription情報の登録のみ
          
          // 1.session自体はstripeの決済画面を呼び出した時にcustomerを紐づけて作成している。
          // 2.session.metadata.ClerkIdはcreateStripeSessionを実行した際に、metadataを挿入しているのでその時に作っている。（checkoutSessionの方）
          // =>上記２点より、sessionの中には実際に決済を行ったユーザーの情報が格納されているかつmetadataとして渡したClerkIdが橋渡し役となっている。

          // subscriptionsを直接createしたり、updateしたりしないの？
          // できるけど、Nestedにしておくと、以下の利点がある。
          // 1. 外部キーはいちいち設定しなくてもモデルが勝手に紐づけてくれる。（今回で言うとuserId）
          // 2. userテーブルの更新とsubscriptionsテーブルの更新を1つの構文で1トランザクション内で実装できる。（これやらないとテーブルごとに文を分けないといけなくなる）

          // なんでstripeCustomer作成時に作成したstripeCustomer.IDでユーザの引き当てをしないの？(ユーザーテーブルにはもってるのに)
          // 別にそれでもいいが、DBとサービス側で認識しやすいデータを使った方が可読性が上がる。（この処理の時はこのIDを使って、この処理の時はこのIDを使うといったようにバラバラだとどこかで指定ミスとか認識相違が生まれやすい）
          await prisma.user.update({
            where: { ClerkId: session.metadata.clerkId},
            data: {
              subscriptionStatus: subscriptionStatus,
              subscriptions: {
                create: {
                  stripeSubscriptionId: subscription.id,
                  stripePriceId: subscription.items.data[0].price.id,
                  stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000)
                }
              }
            }
          })
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
          const update_subscription = event.data.object as Stripe.Subscription;
          console.log(update_subscription)
          if(update_subscription.status === "active") {
            let credits = 5;
            switch(update_subscription.items.data[0].price.id) {
              case priceIdMap.Starter:
                credits = 50;
                break;
              case priceIdMap.Pro:
                credits = 120;
                break;
              case priceIdMap.Enterprise:
                credits = 300;
                break;
            }

            await prisma.user.update({
              where: { stripCustomerId: update_subscription.customer as string },
              data : { credits: credits }
            })
          }
          break;
      }
      return new NextResponse("Stripe Webhook Succeed", {status: 200})
  } catch(error) {
      console.error(error)
      return new NextResponse("Stripe Webhook Error", {status: 400})
  }
}