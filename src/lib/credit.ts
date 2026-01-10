// このファイルにある関数はサーバーコンポーネントでしか実行しないという証
import "server-only"

import { currentUser } from "@clerk/nextjs/server"
import prisma from "./prisma";

export async function getUserCredits() {
    try {
      // クラーク側のユーザー情報
      const user = await currentUser();

      if(!user) {
        return null
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          ClerkId: user.id
        },
        select: {
          credits: true,
        }
      });
      return dbUser?.credits ?? 0;
      
    } catch(error) {
       console.error("Error Fetching user credits:", error)
      return 0
    }
}

export async function decrementUserCredits(clerkId: string) {
  try {

    const dbUser = await prisma.user.update({
      where: {
        ClerkId: clerkId
      },
      data: {
        credits: {
          decrement: 1
        }
      },
      // 上記で減らした後のcreditsを取得できる
      select: {
        credits: true
      }
    });

    return dbUser?.credits ?? 0;
    
  } catch(error) {
     console.error("Error Decrement user credits:", error)
    throw new Error("Failed to update credits")
  }
}