"use client";

import { useSession } from "@/lib/auth-client";

// SessionProvider 现在只用于确保 session 数据可用
// 用户信息直接通过 useSession() hook 获取，不再同步到 Zustand store
export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useSession() 在客户端自动获取 session 数据
  // 无需手动同步到 Zustand，组件直接使用 useSession() 即可
  return <>{children}</>;
}