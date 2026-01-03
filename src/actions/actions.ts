"use server"

import { decrementUserCredits, getUserCredits } from "@/lib/credit";
import { GenerateImageState } from "@/types/actions";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


// カスタムエラークラス
class AuthError extends Error {}
class CreditError extends Error {}

export async function generateImage(
    state: GenerateImageState, 
    formData: FormData
): Promise<GenerateImageState> {

  const keyword = formData.get("keyword");

  // フロントエンド側でrequireを書いているものの、バックエンド側的にはnullで渡ってくる可能性もあるので、
  // ここでnull可能性を排除しておく
  if(!keyword || typeof keyword !== "string") {
      return {
          status: "error",
          error: "キーワードを入力してください"
      }
  }

  try {
    
    const user = await currentUser();

    if(!user) {
      throw new AuthError("ユーザー認証がされていません")
    }

    const credits = await getUserCredits();

    if(!credits || credits <= 0) {
      throw new CreditError("クレジットが不足しています");
    }

    const response = await fetch(`${process.env.BASE_URL}/api/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword })
    })

    if(!response.ok) {
      throw new Error("画像の生成に失敗しました")
    }

    const data = await response.json()
    // クレジットを1消費させる（stabilityのクレジットではなく、我々のサービス内でのクレジット消費）
    await decrementUserCredits(user.id)
    revalidatePath("/dashboard"); // キャッシュを削除することでリアルタイム反映させることができる

    return {
      status: "success",
      imageUrl: data.imageUrl,
      keyword: keyword
    }
  } catch (error) {
    console.log(error)
    if (error instanceof AuthError) {
      return {
        status: "error",
        error: error.message,
      };
    }
    if (error instanceof CreditError) {
      return {
        status: "error",
        error: error.message,
      };
    }
    if (error instanceof Error) {
      return {
        status: "error",
        error: "サーバーでエラーが発生しました: " + error.message,
      }
    }
    return {
      status: "error",
      error: "サーバーで予期せぬエラーが発生しました: ",
    };
  }
}