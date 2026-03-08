"use client";

import { type DefaultSet } from "../config";
import { useGetCountBySetId } from "@/store/todo-app";
import { cloneElement, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { type TodoSet } from "@/generated/prisma/client";
import { useTodo } from "@/contexts/todo-context";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Pencil, Trash2 } from "lucide-react";

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

export function TodoCustomSet({
  item,
  isEditing = false,
  onEditComplete,
  onRename,
  onDelete,
}: {
  item: TodoSet;
  isEditing?: boolean;
  onEditComplete?: () => void;
  onRename?: () => void;
  onDelete?: (setId: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const count = useGetCountBySetId(item.id);
  const { actions } = useTodo();
  const [editName, setEditName] = useState(item.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmedName = editName.trim();
    if (trimmedName && trimmedName !== item.name) {
      await actions.updateTodoSetOptimistic(item.id, { name: trimmedName });
    }
    onEditComplete?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditName(item.name);
      onEditComplete?.();
    }
  };

  const handleDelete = async () => {
    const success = await actions.deleteTodoSetOptimistic(item.id);
    if (success && onDelete) {
      onDelete(item.id);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full px-2 py-1.5 rounded-xs text-xs border border-blue-500 outline-none",
          "bg-white dark:bg-zinc-800"
        )}
      />
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
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
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-40">
        <ContextMenuItem
          onClick={() => onRename?.()}
          className="cursor-pointer"
        >
          <Pencil className="size-4" />
          重命名列表
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={handleDelete}
          variant="destructive"
          className="cursor-pointer"
        >
          <Trash2 className="size-4" />
          删除列表
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
