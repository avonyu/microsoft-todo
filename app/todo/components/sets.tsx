"use client";

import { type DefaultSet } from "../config";
import { useGetCountBySetId } from "@/store/todo-app";
import { cloneElement } from "react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { type TodoSet } from "@/generated/prisma/client";

export function TodoSet({ item }: { item: DefaultSet }) {
  const router = useRouter();
  const pathname = usePathname();
  const count = useGetCountBySetId(item.id);

  return (
    <button
      key={item.id}
      onClick={() => {
        router.push(`/todo/tasks/${item.id}`);
      }}
      className={cn(
        "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xs text-xs transition-colors",
        pathname === `/todo/tasks/${item.id}`
          ? "bg-gray-100 text-gray-800 dark:bg-zinc-700 dark:text-gray-200"
          : "bg-transparent text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700",
      )}
    >
      {/* {item.icon} */}
      {item.icon && cloneElement(
        item.icon as React.ReactElement<{ size?: number; className?: string }>,
        { size: 13, className: "text-gray-400" }
      )}
      {item.label}
      {count > 0 && (
        <span className="ml-auto px-1 text-xs text-gray-600 bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 rounded-full p-0.5">
          {count}
        </span>
      )}
    </button>
  );
}

export function TodoCustomSet({ item }: { item: TodoSet }) {
  const router = useRouter();
  const pathname = usePathname();
  const count = useGetCountBySetId(item.id);

  return (
    <button
      key={item.id}
      onClick={() => {
        router.push(`/todo/tasks/${item.id}`);
      }}
      className={cn(
        "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xs text-xs transition-colors",
        pathname === `/todo/tasks/${item.id}`
          ? "bg-gray-100 text-gray-800 dark:bg-zinc-700 dark:text-gray-200"
          : "bg-transparent text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700",
      )}
    >
      {item.name}
      {count > 0 && (
        <span className="ml-auto text-xs text-gray-600 bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 rounded-lg p-0.5">
          {count}
        </span>
      )}
    </button>
  );
}
