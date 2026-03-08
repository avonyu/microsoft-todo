"use client";

import { useSession } from "@/lib/auth-client";
import { useTodoActions } from "@/store/todo-app";
import { useEffect } from "react";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const setUser = useTodoActions().setUser;

  useEffect(() => {
    // 只有当 session 加载完成且不处于 pending 状态时才更新 store
    // 注意：如果是未登录，session 为 null/undefined，我们也应该更新 store 以反映“未登录”状态
    if (!isPending) {
      // 假设 store 的 user 类型允许 null，如果不允许需做转换
      setUser(
        session?.user
          ? { ...session.user, image: session.user.image ?? null }
          : undefined,
      );
    }
  }, [session, isPending, setUser]);

  return <>{children}</>;
}
