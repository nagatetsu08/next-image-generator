import AuthButton from "../auth/auth-button";
import CreditDisplay from "./credit-display";
import Navitems from "./nav-items";

const DashBoardNav = () => {

  return (
    <nav className="grid gap-2 items-start">
        {/* keyは別に数字でなくても一位であればOK。variantはbuttonの種類のこと */}
        <Navitems />
        <div className="my-4 px-4 md:hidden">
            <AuthButton />
        </div>
        <div className="p-4">
            <CreditDisplay />
        </div>
    </nav>
  )
}

export default DashBoardNav;