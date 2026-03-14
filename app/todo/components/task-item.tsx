"use client";

import { useState } from "react";
import {
  Star,
  StarOff,
  Check,
  Sun,
  Calendar,
  CalendarDays,
  Trash2,
  FolderOutput,
  CircleCheck,
  Circle,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TodoTask } from "@/lib/types/prisma-types";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function TaskItem({
  task,
  className,
  currentSetId,
}: {
  task: TodoTask;
  className?: string;
  currentSetId?: string;
}) {
  const { actions, selectors } = useTodo();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    actions.deleteTaskOptimistic(task.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "bg-gray-50/95 rounded p-3 shadow-sm flex items-center gap-3 hover:bg-white transition-transform",
              "dark:bg-zinc-800/95 dark:hover:bg-zinc-700/95",
              className,
            )}
            onClick={(e) => {
              e.stopPropagation();
              actions.openTaskDetail(task.id);
            }}
          >
            {/* Checkbox */}
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={task.isFinish}
                onChange={(e) => {
                  e.stopPropagation();
                  actions.toggleTaskFinish(task.id);
                }}
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

            {/* Task Item */}
            <div
              className="flex-1 cursor-default"

            >
              <div
                className={cn(
                  "text-sm font-medium",
                  task.isFinish ? "line-through text-gray-500" : "",
                )}
              >
                {task.content}
              </div>
              {currentSetId === "myday" ? (
                <div className="text-xs text-gray-600 dark:text-gray-200 flex items-center gap-1">
                  {task.setId ? (
                    <>
                      {/* 自定义列表图标预留位置 */}
                      {(selectors.getTodoSetById(task.setId) as { emoji?: string }).emoji && (
                        <span className="text-xs">{(selectors.getTodoSetById(task.setId) as { emoji?: string }).emoji}</span>
                      )}
                      {selectors.getTodoSetById(task.setId).label}
                    </>
                  ) : (
                    <>
                      <Home size={12} /> 任务
                    </>
                  )}
                </div>
              ) : currentSetId === "important" ? (
                <div className="text-xs text-gray-600 dark:text-gray-200 flex items-center gap-1">
                  {task.isToday && (
                    <>
                      <Sun size={12} /> 我的一天
                      <span className="mx-1">·</span>
                    </>
                  )}
                  {task.setId ? (
                    <>
                      {(selectors.getTodoSetById(task.setId) as { emoji?: string }).emoji && (
                        <span className="text-xs">{(selectors.getTodoSetById(task.setId) as { emoji?: string }).emoji}</span>
                      )}
                      {selectors.getTodoSetById(task.setId).label}
                    </>
                  ) : (
                    <>
                      <Home size={12} /> 任务
                    </>
                  )}
                </div>
              ) : (
                task.isToday && (
                  <div className="text-xs text-gray-600 dark:text-gray-200 flex items-center gap-1">
                    <Sun size={12} /> 我的一天
                  </div>
                )
              )}
            </div>

            {/* Star */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                actions.toggleTaskImportant(task.id);
              }}
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
              <Sun className="mr-2 h-4 w-4" />
              {task.isToday ? '从"我的一天"中删除' : '添加到"我的一天"'}
              <ContextMenuShortcut>Ctrl + T</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => actions.toggleTaskImportant(task.id)}
            >
              {task.isImportant ? (
                <StarOff className="mr-2 h-4 w-4" />
              ) : (
                <Star className="mr-2 h-4 w-4" />
              )}
              {task.isImportant ? "删除重要标记" : "标记为重要"}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => actions.toggleTaskFinish(task.id)}>
              {task.isFinish ? (
                <Circle className="mr-2 h-4 w-4" />
              ) : (
                <CircleCheck className="mr-2 h-4 w-4" />
              )}
              {task.isFinish ? "标记为未完成" : "标记为已完成"}
              <ContextMenuShortcut>Ctrl + D</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              今天到期
            </ContextMenuItem>
            <ContextMenuItem>
              <CalendarDays className="mr-2 h-4 w-4" />
              明天到期
            </ContextMenuItem>
            <ContextMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              选择日期
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <FolderOutput className="mr-2 h-4 w-4" />
              将任务移动到...
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>默认任务列表</ContextMenuItem>
              <ContextMenuItem>其他任务列表</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={handleDeleteClick}
            className="text-red-500 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            删除任务
            <ContextMenuShortcut>Delete</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除任务</AlertDialogTitle>
            <AlertDialogDescription>
              将永久删除&quot;{task.content}&quot;
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default TaskItem;
