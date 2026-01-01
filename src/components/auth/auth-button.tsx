import React from 'react'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from '../ui/button'

const AuthButton = () => {

  return (
    <div className='flex items-center gap-4'>
      {/* 以下はclerkに用意されているコンポーネント */}
      {/* SignedOutでログインしてない時に表示したいコンポーネントを表示 */}
      <SignedOut>
        {/* mode="modal"にすると、開いている画面でサインイン/サインアップ画面が開く */}
        <SignInButton mode='modal'>
          <Button variant={"outline"}>ログイン</Button>
        </SignInButton>
        <SignUpButton mode='modal'>
          <Button variant={"default"}>新規登録</Button>
        </SignUpButton>
      </SignedOut>
      {/* SignedInでログインしてる時に表示したいコンポーネントを表示 */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default AuthButton