import { NextResponse } from "next/server";

import axios from "axios";
import FormData from "form-data";
import sharp from "sharp";

// export default　async functionでは405エラー
// 本来はここに書かなくても、actions/actions.tsの配下に直接書いても問題ない。
// 今回は練習で書いているだけ。

// Route Handlers (api/.../route.ts) はいつ使うべき？
// Server Actions があるなら、API Route は不要に思えるかもしれませんが、以下のような 「外部から呼ばれる口」 が必要な時だけ使います。

// 1.Webhook: Stripe や GitHub などから通知を受け取る時。

// 2.外部サービスからの利用: モバイルアプリなど、Next.js 以外のクライアントから叩かせたい時。

// 3.ポーリング（Client側からの定期取得）: 前述の「5秒おきに最新状態を確認する」ような処理。

export async function POST(req: Request) {

    const { keyword } = await req.json()
    try {
      const payload = {
        prompt: `Create Image with ${keyword}`,
        output_format: "png"
      };

      const formData = new FormData()
      formData.append('prompt', payload.prompt);
      formData.append('output_format', payload.output_format);

      const response = await axios.postForm(
        `https://api.stability.ai/v2beta/stable-image/generate/core`,
        formData,
        {
          validateStatus: undefined,
          responseType: "arraybuffer",
          headers: { 
            Authorization: `Bearer ${process.env.STABILITY_API_KEY}`, 
            Accept: "image/*" 
          },
        },
      );

      if(response.status !== 200) {
        throw new Error(`API error: ${response.status}`)
      }

      // 画像の最適化
      const optimizedImage = await sharp(response.data)
        .resize(1280, 720)
        .png({quality: 80, compressionLevel: 9})
        .toBuffer();

      // Base64エンコーディング
      const Base64Image = optimizedImage.toString("base64");
      const imageUrl = `data:image/png;base64, ${Base64Image}`;

      // 変数をそのままセットすると、変数名と同じキー名になる
      // オブジェクト形式で返さないと、undefiendになってしまうので注意
      return NextResponse.json({imageUrl})
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Failed to generate image" },
            { status: 500 }
        );
    }
}