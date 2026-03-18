"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signInSchema, SignInData } from "@/lib/zod";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import OAuthButtons from "@/components/oauth-buttons";
import { signInEmail } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: SignInData) {
    setIsLoading(true);
    try {
      const { data, error } = await signInEmail(formData.email, formData.password);

      if (error) {
        toast.error(error.message || "登录失败，请检查邮箱和密码");
        return;
      }

      if (data) {
        toast.success("登录成功");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      toast.error("登录失败，请稍后重试");
      console.error("登录错误:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      className={cn(
        "bg-linear-to-br from-gray-50 to-gray-200",
        "dark:from-gray-900 dark:to-gray-800",
      )}
    >
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full gap-2 max-w-md shadow-xl dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              登录
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="请输入邮箱"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>密码</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="请输入密码"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "登录中..." : "登录"}
                </Button>
                <div className="text-center text-sm">
                  还没有账号？
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-800 underline ml-1"
                  >
                    立即注册
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Separator />
            <OAuthButtons />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}