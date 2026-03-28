"use client";

import { type DefaultSet } from "../lib/default-sets";
import { useGetCountBySetId } from "@/store/todo-app";
import { cloneElement, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { type TodoSet } from "@/lib/types/prisma-types";
import { useTodo } from "@/contexts/todo-context";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";
import { Pencil, Trash2, TextAlignJustify, Smile } from "lucide-react";
import { EmojiPicker } from "./emoji-picker";
import AlertDialogDelete from "./alert-dialog-delete";

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
      {item.icon &&
        cloneElement(
          item.icon as React.ReactElement<{
            size?: number;
            className?: string;
          }>,
          { size: 13, className: "text-gray-400" },
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
  const [emoji, setEmoji] = useState(item.emoji || "");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditName(item.name);
      setEmoji(item.emoji || "");
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isEditing, item.name, item.emoji]);

  const handleSave = async () => {
    const trimmedName = editName.trim();
    if (trimmedName || emoji) {
      await actions.updateTodoSetOptimistic(item.id, {
        name: trimmedName || item.name,
        emoji,
      });
    }
    onEditComplete?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditName(item.name);
      setEmoji(item.emoji || "");
      onEditComplete?.();
    }
  };

  const handleDelete = async () => {
    setShowDeleteDialog(false);
    const success = await actions.deleteTodoSetOptimistic(item.id);
    if (success && onDelete) {
      onDelete(item.id);
    }
  };

  const handleEmojiSelect = async (selectedEmoji: string) => {
    await actions.updateTodoSetOptimistic(item.id, { emoji: selectedEmoji });
  };

  const handleEmojiDelete = async () => {
    await actions.updateTodoSetOptimistic(item.id, { emoji: "" });
    setEmoji("");
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <div className="shrink-0 p-1 rounded">
          {emoji ? (
            <span className="text-sm">{emoji}</span>
          ) : (
            <TextAlignJustify size={13} className="text-gray-400" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full px-2 py-1.5 rounded-xs text-xs border border-blue-500 outline-none",
            "bg-white dark:bg-zinc-800",
          )}
        />
      </div>
    );
  }

  return (
    <>
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
            {item.emoji ? (
              <span className="text-sm">{item.emoji}</span>
            ) : (
              <TextAlignJustify size={13} className="text-gray-400" />
            )}
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
          <ContextMenuSub>
            <ContextMenuSubTrigger className="cursor-pointer">
              <Smile className="size-4 mr-2" />
              设定图标
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="p-0">
              <EmojiPicker onSelect={handleEmojiSelect} onDelete={handleEmojiDelete} showDelete={!!emoji} />
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="cursor-pointer"
          >
            <Trash2 className="size-4" />
            删除列表
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialogDelete
        type="列表"
        content={item.name}
        onDelete={handleDelete}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
