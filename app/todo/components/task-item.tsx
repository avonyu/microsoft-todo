"use client";

import { Star, Check, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { TodoTask } from "@/generated/prisma/client";
import { useTodo } from "@/contexts/todo-context";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuShortcut,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";

function TaskItem({
  task,
  className,
}: {
  task: TodoTask;
  className?: string;
}) {
  const { actions } = useTodo();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "bg-gray-50/95 rounded p-3 shadow-sm flex items-center gap-3 hover:bg-white transition-transform",
            "dark:bg-zinc-800/95 dark:hover:bg-zinc-700/95",
            className,
          )}
        >
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={task.isFinish}
              onChange={() => actions.toggleTaskFinish(task.id)}
              className={cn(
                "appearance-none size-4 rounded-full border-2 border-gray-500",
                "peer checked:bg-gray-500 checked:border-transparent checked:border-0",
                "dark:border-gray-300",
              )}
            />
            <Check
              size={10}
              strokeWidth={4}
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ",
                "text-gray-500 dark:text-gray-200 pointer-events-none opacity-0",
                "peer-checked:opacity-100 peer-checked:text-gray-200 dark:peer-checked:text-gray-900 peer-hover:opacity-100",
              )}
            />
          </div>
          <div className="flex-1">
            <div
              className={cn(
                "text-sm font-medium cursor-default",
                task.isFinish ? "line-through text-gray-500" : "",
              )}
            >
              {task.content}
            </div>
            {task.isToday && (
              <div className="text-xs text-gray-600 dark:text-gray-200 flex items-center gap-1">
                <Sun size={12} /> 我的一天
              </div>
            )}
          </div>
          <button
            onClick={() => actions.toggleTaskImportant(task.id)}
            className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-500"
          >
            <Star
              size={16}
              fill={task.isImportant ? "#6a7282" : "none"}
              className={task.isImportant ? "text-gray-500" : ""}
            />
          </button>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem onClick={() => actions.toggleTaskToday(task.id)}>
            添加到"我的一天"
            <ContextMenuShortcut>Ctrl + T</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => actions.toggleTaskImportant(task.id)}>
            删除重要标记
          </ContextMenuItem>
          <ContextMenuItem onClick={() => actions.toggleTaskFinish(task.id)}>
            标记为已完成
            <ContextMenuShortcut>Ctrl + D</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>今天到期</ContextMenuItem>
          <ContextMenuItem>明天到期</ContextMenuItem>
          <ContextMenuItem>选择日期</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>将任务移动到...</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>默认任务列表</ContextMenuItem>
            <ContextMenuItem>其他任务列表</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => actions.deleteTaskOptimistic(task.id)}
          className="text-red-500"
        >
          删除任务
          <ContextMenuShortcut>Delete</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default TaskItem;