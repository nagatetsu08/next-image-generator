/* eslint-disable @next/next/no-img-element */
'use client';

import { generateImage } from "@/actions/actions";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils";
import { GenerateImageState } from "@/types/actions";
import { Download, ImageIcon, Loader } from "lucide-react";
import { useActionState } from "react"
import LoadingSpiner from "../load-spiner";

const ImageGenerator = () => {

  const initialState: GenerateImageState = {
    status: "idle"
  }

  // ブラウザのリロードなしに即座に作成したイメージをプレビューしたいので、クライアントコンポーネントでないとだめ。
  // 例えば、初回表示だけなら画面リロードが入るのでサーバーコンポーネントでいいがが、数秒に1回データを取得し、表示部分だけリロード
  // というようなuseStateを使うような処理の場合（Client側で定期的にフェッチする）はclientコンポーネント
  const [state, formAction, pending] = useActionState(generateImage, initialState);
  console.log(state)
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyword">キーワード</Label>
            <Input 
              id="keyword" 
              name="keyword" 
              placeholder="作成したい画像のキーワードを入力してください（例：海、山、川）"
              required
            />
          </div>
          {/* submitボタン */}
          <Button 
            disabled={pending} 
            className={cn("w-full duration-200", pending && "bg-primary/80")}
          >
            {pending ? (
              <LoadingSpiner />
            ) : ( 
            <>
              <ImageIcon className="mr-2" />
              画像を生成する
            </>
            )}
          </Button>
        </form>
      </div>
      {/* イメージプレビュー */}
      {state.imageUrl && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg boarder bg-background">
            <div className="aspect-video relative">
              <img 
                src={state.imageUrl}
                alt="Generated Image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <Button className="w-full" variant={"secondary"}>
            <Download className="mr-2" />
            ダウンロード
          </Button>
        </div>
      )}

    </div>
  )
}

export default ImageGenerator