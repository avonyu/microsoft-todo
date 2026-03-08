"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { cn } from "@/lib/utils";

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
import { Separator } from "@/components/ui/separator";
import OAuthButtons from "@/components/oauth-buttons";
import { registerSchema, RegisterData } from "@/lib/zod";

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterData) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/register`,
        {
          username: values.username,
          password: values.password, // 使用明文密码，后端会处理加密
        }
      );

      const data = response.data;

      // 注册成功后跳转到登录页
      router.push("/login");
    } catch (error) {
      console.error("注册失败:", error);
      // TODO: 显示错误信息给用户
    }
  }

  return (
    <main
      className={cn(
        "bg-linear-to-br from-gray-50 to-gray-100",
        "dark:from-gray-900 dark:to-gray-800"
      )}
    >
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full gap-2 max-w-md shadow-xl dark:bg-gray-800">
          <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用户名</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入用户名" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入邮箱" {...field} />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>确认密码</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="请再次输入密码"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  注册
                </Button>
                <div className="text-center text-sm mb-3">
                  已有账号？
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    立即登录
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col">
            <Separator className="mb-3" />
            <OAuthButtons />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
