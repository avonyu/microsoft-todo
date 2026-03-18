import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import UserAvatar from "@/components/user-avatar";
import Image from "next/image";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header
      className={cn(
        "sticky top-0 w-full flex justify-between p-4 bg-white/80 backdrop-blur border-b border-gray-200 z-10",
        "dark:border-gray-800 dark:bg-gray-950/80",
      )}
    >
      <Link
        href="/"
        className={cn(
          "p-1 text-cyan-500 font-bold text-xl",
          "dark:text-cyan-400",
        )}
      >
        {"Microsoft Todo"}
      </Link>
      <div className="flex gap-2 items-center">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="cursor-pointer"
        >
          <a
            href="https://github.com/avonyu/microsoft-todo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/github-mark.png"
              alt="GitHub"
              width={20}
              height={20}
              className="dark:hidden"
            />
            <Image
              src="/github-mark-white.png"
              alt="GitHub"
              width={20}
              height={20}
              className="hidden dark:block"
            />
          </a>
        </Button>

        {session ? (
          <UserAvatar />
        ) : (
          <>
            <Button variant="secondary" className="cursor-pointer" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button className="cursor-pointer" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
