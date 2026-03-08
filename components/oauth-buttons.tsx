import { signInGithub, signInGoogle } from "@/lib/auth-client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function OAuthButtons() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <>
      <Button
        className="w-full"
        variant="outline"
        onClick={() => signInGithub()}
      >
        <Image
          src={isDark ? "/github-mark-white.png" : "/github-mark.png"}
          width={22}
          height={22}
          alt="Github"
        />
        使用 Github
      </Button>
      <Button
        className="w-full"
        variant="outline"
        onClick={() => signInGoogle()}
      >
        <Image
          src="/google.svg"
          width={22}
          height={22}
          alt="Google"
        ></Image>
        使用 Google
      </Button>
    </>
  );
}
