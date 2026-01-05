"use client"

import { PlanItem } from "@/types/plans"
import { Check, LucideIcon, Crown, Rocket, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useActionState, useEffect } from "react"
import { createStripeSession } from "@/actions/stripe"
import { toast } from "sonner"
import LoadingOverlay from "@/components/utility/loading-overlay"
import { StripeState } from "@/types/actions"


const initialState: StripeState = {
  status: "idle",
  error: "",
}

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  rocket: Rocket,
  crown: Crown
}


const PlanCard = ({ plan }: { plan: PlanItem }) => {
  
  const {
    name,
    description,
    iconName, 
    price,
    features,
    buttonText,
    recommend
  } = plan 

  const Icon = ICONS[iconName];

  // client側でコントロールするパターン（教材）
  // ただし、location.hrefで遷移させるのは、Next.js的にあまり推奨されない。
  // 何かの処理をしてから遷移させるという場合は、clientに返した方がいい

  // useActionStateの関数には引数を設定できないので、設定したい場合は以下のように即時関数を書いてやってその中で引数付き関数を呼び出してやる
  // const [state, formAction] = useActionState(async (prevState, formData) => {
  //     const result = await createStripeSession(prevState, formData);

  //     if(result.status === "error") {
  //       toast.error(result.error)
  //     } else if(result.status === "success" && result.redirectUrl) {
  //       window.location.href = result.redirectUrl;
  //     }
  //     return result; //これがstateに入る
  // }, initialState);

  // リダイレクトをサーバーアクション側で完結させるやり方（Next.jsのお作法）
  const [state, formAction, isPending] = useActionState(createStripeSession, initialState);
  useEffect(() => {
    // エラー時のみ、stateが更新される => stateが更新される=useEffectが動く
    // 初回時はAction動かしてないからStateは変更されない。
    // formAction実行して、成功するとこの画面に戻ってくる前にstripe画面にリダイレクトされる。
    if (state) {
      if (state.status === 'error') {
        toast.error(state.error);
      }
    }
  }, [state]);

  // 教材と違うところ。
  // 画面遷移までタイムラグが生じてしまう点を専用のローディング画面を使って、カバー（（コンポーネントの塊が2つになってしまうのでフラグメントを使用）
  return (
    <>
      {/* 1. 画面全体のローディングオーバーレイ */}
      {isPending && (
        <LoadingOverlay
          title="決済画面へ移動中"
          message="安全な支払いページを準備しています..." 
        />
      )}

      {/* 2. メインのカードUI */}
      <div className={`border rounded-xl bg-card p-8 shadow-sm flex flex-col ${recommend ? "ring-2 ring-primary scale-105" : ''}`}>
        {/* formのボタンを一番下に配置したいので、flex-1を使って、余白スペースを全部使って、びよーんと伸びろ */}
        <div className='space-y-6 flex-1'>
          <div className='space-y-4'>
            {recommend && (
              // w-fitは文字に横幅を合わせる
              <div className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary w-fit">人気プラン</div>
            )}
            <div className='flex items-center gap-2'>
              {Icon && <Icon className='size-6 text-primary'/>}
              <h2 className='text-2xl font-bold'>{name}</h2>
            </div>
            <p className='text-muted-foreground'>{description}</p>
          </div>
        
          <div className='flex items-baseline'> 
            <span className='text-4xl font-bold'>{price}</span>
            <span className='ml-2 text-muted-foreground'>/月</span>
          </div>
        
          {features && features.length > 0 && (
            <ul className='space-y-4 text-sm'>
              {features.map((feature, index) => (
                <li key={index} className='flex items-center gap-3'>
                  <Check className='size-4 text-primary'/>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form action={formAction}>
          <input name="priceId" value={plan.priceId} type="hidden" />
          <Button 
            className='w-full mt-8' 
            size={"lg"} 
            variant={recommend ? "default" : "outline"} 
            type='submit'
            disabled={isPending} // 送信中はボタンも無効化
          >
            {buttonText}
          </Button>
        </form>
      </div>
    </>
  )
}

export default PlanCard