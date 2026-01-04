import AuthButton from "@/components/auth/auth-button";
import MobileNav from "@/components/dashboard/mobile-nav";
import DashBoardNav from "@/components/dashboard/nav";
import Link from "next/link";
import { Toaster } from 'sonner'

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        {/* header */}
        <header className="sticky top-0 z-40 border-b bg-background">
            <div className="flex items-center h-16 px-6">
                <MobileNav />
                <div className="flex w-full">                
                    <Link href="/">
                        <h1 className="text-lg font-bold">AI Image Generator</h1>
                    </Link>
                    {/* 認証ボタンはデフォルトhidden。md以上で表示するようにする。（md以下はスライドメニュー内に表示するように変更 */}
                    <div className="ml-auto hidden md:block">
                        <AuthButton />
                    </div>
                </div>
            </div>
        </header>

        {/* sidebar and main */}
        {/* 画面がmd(横幅768px)以上になった時だけ、１列目を220px固定、残りを画面いっぱい（minmax(0,1fr)） */}
        {/* md:gap-6はグリッドアイテム間に隙間を作る（６で1.5remという意味） */}
        <div className="md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
            {/* side-bar */}
            {/* h-[calc(100vh-4rem)はheaderの高さをサイドバーの高さからぬいている。
                これによってスクロールが発生しないようにしている。 サイドバーは常にスクロールさせずに表示させたいのでこうしている。
            */}
            <aside className="sticky top-16 z-30 hidden md:block border-r h-[calc(100vh-4rem)]">
                <div className="py-6 px-2 lg:py-8">
                    <DashBoardNav />
                </div>
            </aside>
            {/* main-contents */}
            {/* pは全方位にpadding */}
            <main className="flex w-full flex-col overflow-hidden p-4">
                {children}
                <Toaster richColors closeButton />
            </main>
        </div>
    </div>
  );
}
