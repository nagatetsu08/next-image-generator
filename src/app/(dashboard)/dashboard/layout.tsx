import MobileNav from "@/components/dashboard/mobile-nav";
import DashBoardNav from "@/components/dashboard/nav";
import Link from "next/link";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        {/* header */}
        <header className="sticky top-0 z-40 border-b bg-background">
            <div className="container flex items-center h-16 px-4">
                <MobileNav />
                <Link href="/">
                    <h1 className="text-lg font-bold">AI Image Generator</h1>
                </Link>
            </div>
        </header>

        {/* sidebar and main */}
        {/* 画面がmd(横幅768px)以上になった時だけ、１列目を220px固定、残りを画面いっぱい（minmax(0,1fr)） */}
        {/* md:gap-6はグリッドアイテム間に隙間を作る（６で1.5remという意味） */}
        <div className="container md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
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
            </main>
        </div>
    </div>
  );
}
