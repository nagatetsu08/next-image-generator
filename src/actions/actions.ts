"use server"

import { GenerateImageState } from "@/types/actions";

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
      const response = await fetch(`${process.env.BASE_URL}/api/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application-json",
        },
        body: JSON.stringify({ keyword })
      })

      
      const data = await response.json()


      return {
        status: "success",
        imageUrl: data.imageUrl,
        keyword: keyword
      }
    } catch (error) {
      console.log(error)
      return {
        status: "error",
        error: "画像の生成に失敗しました"
      }
    }
  }