'use client';

import { Button } from '@/components/ui/button'
import { User } from '@prisma/client'
import { useState } from 'react';
import LoadingOverlay from '@/components/utility/loading-overlay'

interface SettingsFormProps {
  user: User
}

const SubscriptionSettingsForm = ({user} : SettingsFormProps) => {

  // 教材ではuseRouterを使って遷移させているが、useRouterはアプリ内部遷移を強制させたい時に使うもの
  // 今回のように外部サイトを使う場合は、clientコンポーネントの場合はwindow.location.hrefを使うのがセオリー。

  const [isPending, setIsPending] = useState(false);

  const handleManageSubscription = async() => {
    try {
      setIsPending(true); // 処理開始時に表示

      const response = await fetch("/api/create-portal-session", {
        method: "POST"
      })

      const data = await response.json();

      // 外部サイトへの遷移
      if (data.url) {
        window.location.href = data.url;
      } else {
        setIsPending(false); // URLがない場合は解除
      }
    } catch(error) {
      console.log(error)
      setIsPending(false); // エラー時は入力を受け付けられるよう非表示に戻す
    }
  };

  return (
    <>
      {isPending && <LoadingOverlay />}
      <div className='grid gap-4 border-2 rounded-lg'>
        <div className='grid gap-2'>
          {user?.subscriptionStatus !== "FREE" ? (
            // 勉強がてらイベントハンドラーで呼び出してみる
            <>
              <p className='text-sm text-muted-foreground'>現在のサブスクリプションを管理します。</p>
              <Button onClick={handleManageSubscription}>サブスクリプション管理</Button>
            </>
          ) : (
            <>
              <p className='text-sm text-muted-foreground'>有料プランに加入していません。</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default SubscriptionSettingsForm