import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const user = await currentUser();
    
    if(!user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401}) 
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        ClerkId: user.id
      }
    })

    if(!dbUser?.stripCustomerId) {
      return NextResponse.json({error: "No StripeCustomerId"}, {status: 401}) 
    }    

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripCustomerId,
      return_url: `${process.env.BASE_URL}/dashboard/settings`,
    })
    return NextResponse.json({url: session.url})

  } catch(error) {
    console.error(error)
    return NextResponse.json({error: "Internal Error"}, {status: 500})
  }
}