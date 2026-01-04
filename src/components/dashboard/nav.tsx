import Link from "next/link";
import AuthButton from "../auth/auth-button";
import CreditDisplay from "./credit-display";
import Navitems from "./nav-items";
import { Button } from "../ui/button";
import { currentUser } from "@clerk/nextjs/server";

const DashBoardNav = async() => {

  const user = await currentUser()

  return (
    <nav className="grid gap-2 items-start">
        {/* keyは別に数字でなくても一位であればOK。variantはbuttonの種類のこと */}
        <Navitems />
        <div className="my-4 px-4 md:hidden">
            <AuthButton />
        </div>
        <div className="p-4">
            <CreditDisplay />
            {/* asChildにすることでButtonタグを生成するのではなくするのではなく、Buttonのスタイルを子要素のLinkに適用する形になる */}
            {user && (
              <Button asChild className="w-full mt-4" variant={"default"}>
                <Link href={"/dashboard/plan"}>アップグレード</Link>
              </Button>
            )}
        </div>
    </nav>
  )
}

export default DashBoardNav;