import Stripe from "stripe";
import prisma from "./prisma";
import { SubscriptionStatus } from "@prisma/client";
import { STRIPE_PLANS, plans } from "@/config/plans";


async function getPlanDetails(subscription: Stripe.Subscription) {

  const priceId = subscription.items.data[0].price.id;
  let subscriptionStatus:SubscriptionStatus = "FREE"
  let credits = 5 

  switch(priceId) {
    case STRIPE_PLANS.STARTER:
      subscriptionStatus = "STARTER"
      credits = 50
      break;
    case STRIPE_PLANS.Pro:
      subscriptionStatus = "PRO"
      credits = 120
      break;
    case STRIPE_PLANS.Enterprise:
      subscriptionStatus = "ENTERPRISE"
      credits = 300
      break;
  }

  return {priceId, subscriptionStatus, credits}

}

export async function handleSubscriptionCreated(subscription: Stripe.Subscription) {

  const {priceId, subscriptionStatus, credits} = await getPlanDetails(subscription);

  return prisma.user.update({
      where : {
        stripCustomerId: subscription.customer as string
      },
      data : {
        subscriptionStatus: subscriptionStatus,
        credits: credits,
        subscription: {
          create: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000)
          }
        }
      }
  })
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const {priceId, subscriptionStatus, credits} = await getPlanDetails(subscription);

  return prisma.user.update({
      where : {
        stripCustomerId: subscription.customer as string
      },
      data : {
        subscriptionStatus: subscription.cancel_at_period_end ? "FREE" :  subscriptionStatus,
        credits: subscription.cancel_at_period_end ? 5 : credits,
        subscription: {
          update: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000)
          }
        }
      }
  })
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {

  return prisma.user.update({
      where : {
        stripCustomerId: subscription.customer as string
      },
      data : {
        subscriptionStatus: "FREE",
        credits: 5,
        subscription: {
          delete: {
            stripeSubscriptionId: subscription.id
          }
        }
      }
  })
}