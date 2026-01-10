import { plans } from "@/config/plans";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { handleSubscriptionCreated, handleSubscriptionDeleted, handleSubscriptionUpdated } from "@/lib/subscriptions";
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
    
  try {
      event = stripe.webhooks.constructEvent(
          body,
          signature,
          endpointSecret
      )

      if(!event) {
        return NextResponse.json("No Webhook event", {status: 500})
      }


       const subscription = event.data.object as Stripe.Subscription

      if (!subscription) {
        return NextResponse.json("no subscription", {status: 500})
      }

      switch(event.type){
        case "customer.subscription.created":

          await handleSubscriptionCreated(subscription);
          break;

        case "customer.subscription.updated":

          await handleSubscriptionUpdated(subscription);
          break;

        case "customer.subscription.deleted":

          await handleSubscriptionDeleted(subscription);
          break;

      }
      return NextResponse.json("Stripe Webhook Succeed", {status: 200})
  } catch(error) {
      console.error(error)
      return NextResponse.json("Stripe Webhook Error", {status: 500})
  }
}