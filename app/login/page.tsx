"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  CardAction,
  CardContent,
  CardDescription,
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

export default function LoginPage() {
  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: SignInData) {
    // "use server";
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
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  登录
                </Button>
                <div className="text-center text-sm">
                  还没有账号？
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-800 underline"
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
