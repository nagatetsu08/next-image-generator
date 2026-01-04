/* eslint-disable @next/next/no-img-element */
'use client';

import { generateImage } from "@/actions/actions";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils";
import { GenerateImageState } from "@/types/actions";
import { Download, ImageIcon } from "lucide-react";
import { useActionState } from "react"
import LoadingSpiner from "../load-spiner";
import { toast } from 'sonner'
import { useUser } from "@clerk/nextjs";
import { SignInButton, SignedIn } from "@clerk/clerk-react";

const ImageGenerator = () => {

  // このようなHooksはクライアントコンポーネントでしか使えない
  const { isSignedIn } = useUser();

  const initialState: GenerateImageState = {
    status: "idle"
  }

  const handleDownload = () => {

    if(!state.imageUrl) {
      return
    }

    try {
      // javascriptを使ってブラウザ経由で画像をダウンロードできるようにするおまじない。
      //　やることは、1.imageのblobオブジェクト生成。2.隠しリンク作成 3.bodyに追加して、リンククリック

      // Blobオブジェクト生成
      const base64Data = state.imageUrl.split(",")[1];
      const blob = new Blob([Buffer.from(base64Data, "base64")], {type: "image/png"});
      
      // 隠しリンク生成
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url
      link.download = `${state.keyword}.png`

      document.body.appendChild(link);
      link.click();

      // 後処理（作成したオブジェクトやリンクを破棄（メモリリークを防ぐため））
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url)

      toast.success("ダウンロード完了")

    } catch(error) {
      console.error(error)
      toast.error("ダウンロードに失敗しました")
    }
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
          {isSignedIn ? 
            (
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
            ) : 
            (
              // このボタン自体はログイン画面を表示するボタン（未ログイン時はログイン画面をだし、仮にログインしていたら、無視される）
              // 通常ログインしていたら、isSignedIn=trueの方に入るので以下の画面には辿りつかない
              <SignInButton>
                <Button className="w-full">
                  <ImageIcon className="mr-2">
                    ログインして画像を生成  
                  </ImageIcon>
                </Button>
              </SignInButton>
            )
          }

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
          <Button 
            className="w-full" 
            variant={"secondary"} 
            onClick={handleDownload}
          >
            <Download className="mr-2" />
            ダウンロード
          </Button>
        </div>
      )}

    </div>
  )
}

export default ImageGenerator