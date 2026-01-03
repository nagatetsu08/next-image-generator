import { NextResponse } from "next/server"
import prisma from "./prisma"

export async function createUser(clerkId: string, email: string) {
    try {
        const user = await prisma.user.create({
            data: {
                ClerkId: clerkId,
                email: email,
                credits: 5,
                subscriptionStatus: "FREE"
            }
        })
        return NextResponse.json({ user }, {status: 201})
    } catch(error) {
        console.error("Failed to create user", error)
        return NextResponse.json({ error }, { status: 500 })
    }
}

export async function updateUser(clerkId: string, email: string) {
    try {
        const user = await prisma.user.update({
            where: { ClerkId: clerkId },
            data: {
                email: email
            }
        })
        return NextResponse.json({ user }, {status: 200})
    } catch(error) {
        console.error("Failed to create user", error)
        return NextResponse.json({ error }, { status: 500 })
    }
}

export async function deleteUser(clerkId: string) {
    try {
        const user = await prisma.user.delete({
            where: { ClerkId: clerkId }
        })
        return NextResponse.json({ user }, {status: 200})
    } catch(error) {
        console.error("Failed to create user", error)
        return NextResponse.json({ error }, { status: 500 })
    }
}