"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ComponentProps } from "react";

const menuItems = [
  { title: "Home", href: "/" },
  { title: "Features", href: "/features" },
  { title: "Pricing", href: "/pricing" },
  { title: "About", href: "/about" },
  { title: "FAQ", href: "/faq" },
  { title: "Contact", href: "/contact" },
];

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
      {menuItems.map((item) => (
        <NavigationMenuItem key={item.href} className="hover:bg-accent hover:text-accent-foreground  text-foreground transition-colors rounded-md">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href={item.href} className="hover:bg-accent hover:text-accent-foreground transition-colors">{item.title}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);
