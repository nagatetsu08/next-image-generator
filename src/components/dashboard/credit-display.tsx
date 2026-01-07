import { getUserCredits } from "@/lib/credit"
import { currentUser } from "@clerk/nextjs/server";
import { Loader2, Lock } from "lucide-react";
import { Suspense } from "react";

// Todo
// 月内のアップグレード/ダウングレードに対応させたい(具体的には今月何プラン、来月何プランってのを表示させたい)

// fallback用のコンポーネント
const CreditSkeleton = () => (
  <div className="rounded-lg border bg-background p-4">
    <div className="test-sm font-medium text-muted-foreground">残りクレジット</div>
    <div className="mt-2 flex items-center gap-2 text-muted-foreground">
      <Loader2 className="size-3 animate-spin"/>
      <span className="text-muted-foreground">ロード中です</span>
    </div>
  </div>
);

async function CreditContents() {

  const user = currentUser();

  if(!user) {
    return (
      <div className="rounded-lg border bg-background p-4">
          <div className="test-sm font-medium text-muted-foreground">残りクレジット</div>
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <Lock className="size-3"/>
            <span>ログインが必要です</span>
          </div>
      </div>
    )    
  }

  const credits = await getUserCredits();

  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="text-sm font-medium text-muted-foreground">残りクレジット</div>
      <div className="mt-2 font-bold">{credits} クレジット</div>
    </div>
  )
}


const CreditDisplay = async() => {

  return (
    // サーバーコンポーネントにおいては、ux的にストリーミングの方がいい（ロード完了前にコンポーネントは表示しちゃうけど、ロード完了まではフォールバックコンテンツ（ロード中だよ）を表示する。）
    // ただし、Suspense配下は要素をべたがきしても、fallbackがちゃんと機能しない。必ず表示するコンポーネント自体をasync functionでラッピング化して、そいつを呼び出さないとだめ。
    <Suspense fallback={<CreditSkeleton />}>
      <CreditContents />
    </Suspense>

  )
}

export default CreditDisplay