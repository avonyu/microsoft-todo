import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className={cn(
        "bottom-0 w-full bg-gray-100 border-t border-gray-200",
        "dark:bg-gray-900 dark:border-gray-800"
      )}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className={cn("text-sm text-gray-600", "dark:text-gray-400")}>
            © {new Date().getFullYear()} Microsoft Todo. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link
              href="/about"
              className={cn(
                "text-sm text-gray-600 hover:text-gray-900",
                "dark:text-gray-400 dark:hover:text-gray-100"
              )}
            >
              About
            </Link>
            <Link
              href="/privacy"
              className={cn(
                "text-sm text-gray-600 hover:text-gray-900",
                "dark:text-gray-400 dark:hover:text-gray-100"
              )}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className={cn(
                "text-sm text-gray-600 hover:text-gray-900",
                "dark:text-gray-400 dark:hover:text-gray-100"
              )}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}