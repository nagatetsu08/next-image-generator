'use client'

import { usePathname } from "next/navigation";
import { navItems } from '@/config/nav'
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
const Navitems = () => {

    // 現在選んでいるリンクを取得する。これはclientモードでしか動かない
    const pathname = usePathname()

  return (
    <>
        {navItems.map((item) => (
            <Button key={item.href} 
                variant={pathname === item.href ? "secondary": "ghost"}
                className={cn("justify-start", pathname === item.href && "bg-accent")}
                asChild
            >
                <Link href={item.href}>
                    {item.icon && <item.icon className="h4 w-4 mr-2"/>}
                    {item.title}
                </Link>
            </Button>
        ))}
    </>
  )
}

export default Navitems