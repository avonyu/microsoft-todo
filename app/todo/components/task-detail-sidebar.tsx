"use client";

import { Resizable } from "re-resizable";
import { X, Paperclip, CalendarDays, CalendarSync, AlarmClock, Trash2, Star, Plus, Check, Sun, UserRoundPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTodo } from "@/contexts/todo-context";
import AlertDialogDelete from "./alert-dialog-delete";
import { useState, useRef, useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import { changeTodoTask } from "@/lib/actions/todo/todo-actions";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogCancel, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogContent, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button'

interface TaskDetailSidebarProps {
  taskId: string;
  onClose: () => void;
  initialWidth?: number;
  bgColor?: string;
}

const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function formatDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];
  return `${month}月${day}日，${weekday}`;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) {
    return "片刻前";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else {
    return formatDate(date);
  }
}

export function TaskDetailSidebar({ taskId, onClose, initialWidth = 380, bgColor }: TaskDetailSidebarProps) {
  const { state, actions, selectors } = useTodo();
  const [comment, setComment] = useState('')
  const [isEditingContent, setIsEditingContent] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    // 从 localStorage 读取记忆的宽度
    const saved = localStorage.getItem('task-detail-sidebar-width');
    return saved ? parseInt(saved, 10) : initialWidth;
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const task = state.tasks.find((t) => t.id === taskId);

  // 切换任务时重置备注内容
  useEffect(() => {
    setComment(task?.comment || '');
  }, [taskId, task?.comment]);

  // 调整textarea高度
  useEffect(() => {
    adjustTextareaHeight();
  }, [comment]);

  // 记忆宽度到 localStorage
  const handleResizeStop = (_e: MouseEvent | TouchEvent, _direction: string, _ref: HTMLElement, d: { width: number; height: number }) => {
    const newWidth = sidebarWidth + d.width;
    setSidebarWidth(newWidth);
    localStorage.setItem('task-detail-sidebar-width', newWidth.toString());
  };

  if (!task) return null;

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

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

  // 失焦时保存备注
  const handleCommentBlur = async () => {
    if (comment !== task.comment) {
      const res = await changeTodoTask(task.id, {
        comment: comment,
        commentUpdateAt: comment ? new Date() : null
      });
      if (res.success && res.data) {
        actions.updateTask(res.data);
      }
    }
  };

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
      size={{ width: sidebarWidth }}
      onResizeStop={handleResizeStop}
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
                <div className="relative flex items-center justify-center mt-1">
                  <input
                    type="checkbox"
                    checked={task.isFinish}
                    onChange={handleToggleFinish}
                    style={{
                      borderColor: '#6b7280',
                      backgroundColor: task.isFinish ? (bgColor || '#6b7280') : undefined,
                    }}
                    className={cn(
                      "appearance-none size-4 rounded-full border-2",
                      "peer checked:border-transparent checked:border-0",
                      "dark:border-gray-300",
                    )}
                  />
                  <Check
                    size={10}
                    strokeWidth={4}
                    className={cn(
                      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                      "text-gray-500 dark:text-gray-200 pointer-events-none opacity-0",
                      "peer-checked:opacity-100 peer-checked:text-gray-200 dark:peer-checked:text-gray-900 peer-hover:opacity-100",
                    )}
                  />
                </div>
                {isEditingContent ? (
                  <input
                    className={cn(
                      "flex-auto text-base font-medium bg-transparent focus:outline-none",
                      task.isFinish && "line-through decoration-1 text-gray-500"
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
                      task.isFinish && "line-through decoration-1 text-black"
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
                  onClick={() => handleToggleImportant()}
                />
              </div>
              <div className="text-xs text-sky-700 flex gap-2"><Plus size={14} />添加步骤</div>
            </div>

            {/* My Day */}
            <div className="border bg-zinc-50 w-full rounded-xs flex">
              <button
                className={cn(
                  "flex-1 py-2 px-3 h-10 space-y-6 flex items-center gap-2 text-gray-600 text-xs",
                  !task.isToday && "hover:bg-zinc-100",
                  task.isToday && "text-sky-700"
                )}
                onClick={() => !task.isToday && handleToggleToday()}
              >
                <Sun size="14" className={task.isToday ? "text-sky-700" : ""} />
                {task.isToday ? "已添加到我的一天" : "添加到我的一天"}
              </button>
              {task.isToday &&
                <button
                  className="hover:bg-zinc-100 py-2 px-3 h-10 space-y-6 flex items-center gap-2 text-gray-600 text-xs"
                  onClick={() => task.isToday && handleToggleToday()}
                >
                  <X size="14" />
                </button>
              }
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="border bg-zinc-50 hover:bg-zinc-100 w-full rounded-xs py-2 px-3 h-10 space-y-6 flex items-center gap-2 text-gray-600 text-xs" >
                  <UserRoundPlus size={14} />
                  分配给
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-sm p-3 gap-3 w-75">
                <AlertDialogHeader>
                  <AlertDialogTitle className="w-full text-center text-sm">分配给</AlertDialogTitle>
                  <Separator />
                  <AlertDialogDescription className="space-y-2">
                    <div className="text-center">Pic. placeholder</div>
                    <div className="text-black mb-5 text-center">
                      请邀请一些人员。在其加入后，将在此处显示。
                    </div>
                    <Button size="sm" className="w-full h-7 text-xs bg-sky-700 hover:bg-sky-600 rounded-sm">创建邀请链接</Button>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Separator />
                <AlertDialogFooter>
                  <AlertDialogCancel size="sm" className="text-xs w-15 rounded-sm h-7!">关闭</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Add Files */}
            <button className="border bg-zinc-50 hover:bg-zinc-100 w-full rounded-xs py-2 px-3 h-10 space-y-6 flex items-center gap-2 text-gray-600 text-xs" onClick={() => handleAddFile}>
              <Paperclip size={14} />
              添加文件
            </button>

            {/* Comment */}
            <div className="border bg-zinc-50 w-full rounded-xs p-3">
              <textarea
                ref={textareaRef}
                className="focus:outline-none text-xs placeholder:text-xs placeholder:text-gray-600 w-full resize-none overflow-hidden"
                placeholder="添加备注"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onBlur={handleCommentBlur}
              />
              {comment && task.commentUpdateAt && (
                <div className="text-xs text-zinc-500 mt-1">更新于 {formatRelativeTime(new Date(task.commentUpdateAt))}</div>
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
