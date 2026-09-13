import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { IconArrowLeft, IconHome, IconSearch } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            404 Error
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Sorry, we could not find the page you are looking for. It may have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild>
            <Link href="/dashboard">
              <IconHome className="size-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <IconArrowLeft className="size-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
          Need help? <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 underline">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
