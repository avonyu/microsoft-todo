"use client";

import { Resizable } from "re-resizable";
import { X, Paperclip, CalendarDays, CalendarSync, AlarmClock, Trash2, Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTodo } from "@/contexts/todo-context";
import AlertDialogDelete from "./alert-dialog-delete";
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { changeTodoTask } from "@/lib/actions/todo/todo-actions";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

interface TaskDetailSidebarProps {
  taskId: string;
  onClose: () => void;
  initialWidth?: number;
}

const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function formatDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];
  return `${month}月${day}日，${weekday}`;
}

export function TaskDetailSidebar({ taskId, onClose, initialWidth = 380 }: TaskDetailSidebarProps) {
  const { state, actions, selectors } = useTodo();
  const [commentUpdateTime, setCommentUpdateTime] = useState('')
  const [isEditingContent, setIsEditingContent] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const task = state.tasks.find((t) => t.id === taskId);

  if (!task) return null;

  const handleStartEdit = () => {
    setEditedContent(task.content)
    setIsEditingContent(true)
  }

  const handleSaveEdit = async () => {
    if (editedContent.trim() && editedContent !== task.content) {
      // Update task content
      const res = await changeTodoTask(task.id, { content: editedContent.trim() })
      if (res.success && res.data) {
        actions.updateTask(res.data)
      }
    }
    setIsEditingContent(false)
  }

  const handleCancelEdit = () => {
    setIsEditingContent(false)
  }

  const handleToggleImportant = () => {
    actions.toggleTaskImportant(task.id);
  };

  const handleToggleToday = () => {
    actions.toggleTaskToday(task.id);
  };

  const handleToggleFinish = () => {
    actions.toggleTaskFinish(task.id);
  };

  const handleDelete = () => {
    actions.deleteTaskOptimistic(task.id);
    onClose();
  };

  const handleAddFile = () => {

  }

  return (
    <Resizable
      defaultSize={{ width: initialWidth }}
      enable={{ left: true }}
      minWidth={300}
      maxWidth={600}
      handleStyles={{
        left: {
          width: "6px",
          cursor: "ew-resize",
          backgroundColor: "transparent",
        },
      }}
      handleComponent={{
        left: (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-blue-400 transition-colors rounded-l-md" />
        ),
      }}
    >
      <div className="flex flex-col h-full relative bg-zinc-100 dark:bg-zinc-800 border-l border-gray-200 dark:border-zinc-700">
        <div className="h-full w-full flex flex-col px-3 pt-1 overflow-hidden relative">
          {/* Header */}
          <div className="mb-2 flex flex-row-reverse border-gray-200 dark:border-zinc-600">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-sm transition-colors"
            >
              <X size={15} className="text-zinc-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {/* Main Card */}
            <div className="border bg-zinc-50 w-full rounded-xs p-3 min-h-18 space-y-4">
              <div className="flex justify-between gap-2">
                <input
                  type="checkbox"
                  checked={task.isFinish}
                  onChange={handleToggleFinish}
                  className={cn(
                    "mt-1 appearance-none size-4 rounded-full border-2 border-gray-500",
                    "peer checked:bg-gray-500 checked:border-transparent",
                  )}
                />
                {isEditingContent ? (
                  <input
                    className={cn(
                      "flex-auto text-base font-medium bg-transparent focus:outline-none",
                      task.isFinish && "line-through text-gray-500"
                    )}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit()
                      if (e.key === 'Escape') handleCancelEdit()
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={handleStartEdit}
                    className={cn(
                      "flex-auto text-base font-medium text-gray-800 dark:text-gray-100",
                      task.isFinish && "line-through text-gray-500"
                    )}
                  >
                    {task.content}
                  </span>
                )}
                <Star
                  size={16}
                  className={cn(
                    "mt-1",
                    task.isImportant ? "text-gray-500 fill-gray-500" : "text-gray-500"
                  )}
                  onClick={() => actions.toggleTaskImportant(task.id)}
                />
              </div>
              <div className="text-xs text-sky-700 flex gap-2"><Plus size={14} />添加步骤</div>
            </div>

            {/* Time */}
            <div className="border bg-zinc-50 p-0.5 w-full rounded-xs min-h-18">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-gray-600 text-xs p-3 w-full hover:bg-zinc-100 rounded-sm" onClick={() => handleAddFile}>
                    <AlarmClock size={14} />
                    提醒我
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    今天晚些时候
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    明天
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    下周
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    选择日期和时间
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="mx-3">
                <Separator />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-gray-600 text-xs p-3 w-full hover:bg-zinc-100 rounded-sm">
                    <CalendarDays size={14} />
                    添加截止日期
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    今天
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    明天
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    下周
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    选择日期
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="mx-3">
                <Separator />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-gray-600 text-xs p-3 w-full hover:bg-zinc-100 rounded-sm" onClick={() => handleAddFile}>
                    <CalendarSync size={14} />
                    重复
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    每天
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    工作日
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    每周
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    每月
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    每年
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    自定义
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Add Files */}
            <button className="border bg-zinc-50 hover:bg-zinc-100 w-full rounded-xs py-2 px-3 h-10 space-y-6 flex items-center gap-2 text-gray-500 text-xs" onClick={() => handleAddFile}>
              <Paperclip size={14} />
              添加文件
            </button>

            {/* Comment */}
            <div className="border bg-zinc-50 w-full rounded-xs p-3 min-h-18 space-y-6">
              <input
                className="focus:outline-none text-sm placeholder:text-xs placeholder:text-gray-500"
                placeholder="添加备注"
                value={commentUpdateTime}
                onChange={(e) => setCommentUpdateTime(e.target.value)}
              />
              {commentUpdateTime && (
                <div className="text-xs text-zinc-500">更新于 {formatDate(new Date())}</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex w-full bg-zinc-100 dark:bg-zinc-800 border-t border-t-zinc-200">
          <span className="p-3 flex-auto text-center text-zinc-500 text-xs">创建于 {formatDate(new Date(task.createdAt))}</span>
          <AlertDialogDelete type="任务" content={task.content} onDelete={handleDelete}>
            <button className="px-2 h-full hover:bg-zinc-200 dark:hover:bg-zinc-700">
              <Trash2 size={16} className="text-zinc-500 mr-1" />
            </button>
          </AlertDialogDelete>
        </div>
      </div>
    </Resizable >
  );
}
