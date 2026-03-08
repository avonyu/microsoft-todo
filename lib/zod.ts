"use client"

import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("无效邮箱"),
  password: z.string().min(6, "密码至少需要6个字符"),
})

export const registerSchema = z
  .object({
    username: z.string().min(1, "用户名不能为空"),
    email: z.string().email("无效邮箱"),
    password: z.string().min(6, "密码至少需要6个字符"),
    confirmPassword: z.string().min(6, "请确认密码"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

export type SignInData = z.infer<typeof signInSchema>
export type RegisterData = z.infer<typeof registerSchema>
