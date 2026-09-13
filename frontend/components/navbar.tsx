import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-2 inset-x-4 h-16 bg-background border max-w-(--breakpoint-xl) mx-auto rounded-full z-50">
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <Logo />
        <span className="text-lg font-bold tracking-tight">BizPilot</span>
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          {/* <Button 
          className="rounded-full"
          >
            Get Started
          </Button> */}

          <Link href='/get-started'>
            <Button
              className="rounded-full"
            >
              Get Started
            </Button></Link>
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
