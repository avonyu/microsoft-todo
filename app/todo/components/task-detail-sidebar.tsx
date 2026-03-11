"use client";

import { Resizable } from "re-resizable";
import { X, Calendar, Sun, Star, Trash2, Clock, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTodo } from "@/contexts/todo-context";

interface TaskDetailSidebarProps {
  taskId: string;
  onClose: () => void;
  initialWidth?: number;
}

export function TaskDetailSidebar({ taskId, onClose, initialWidth = 380 }: TaskDetailSidebarProps) {
  const { state, actions, selectors } = useTodo();
  const task = state.tasks.find((t) => t.id === taskId);

  if (!task) return null;

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
      <div className="h-full bg-white dark:bg-zinc-800 border-l border-gray-200 dark:border-zinc-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">任务详情</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Task title */}
          <div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={task.isFinish}
                onChange={handleToggleFinish}
                className={cn(
                  "mt-1 appearance-none size-5 rounded-full border-2 border-gray-500",
                  "peer checked:bg-gray-500 checked:border-transparent",
                )}
              />
              <span
                className={cn(
                  "text-base font-medium text-gray-800 dark:text-gray-100",
                  task.isFinish && "line-through text-gray-500"
                )}
              >
                {task.content}
              </span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleToggleToday}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                task.isToday
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
              )}
            >
              <Sun size={16} />
              {task.isToday ? "我的一天" : '添加到"我的一天"'}
            </button>

            <button
              onClick={handleToggleImportant}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                task.isImportant
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
              )}
            >
              <Star size={16} fill={task.isImportant ? "currentColor" : "none"} />
              {task.isImportant ? "重要" : "标记为重要"}
            </button>
          </div>

          {/* Due date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              <Calendar size={16} />
              截止日期
            </label>
            <div className="pl-6">
              {task.dueDate ? (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(task.dueDate).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              ) : (
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  添加日期
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              <List size={16} />
              列表
            </label>
            <div className="pl-6">
              {task.setId ? (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {selectors.getTodoSetById(task.setId).label}
                </span>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">任务</span>
              )}
            </div>
          </div>

          {/* Created/Updated info */}
          <div className="pt-4 border-t border-gray-200 dark:border-zinc-700 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={14} />
              <span>创建于 {new Date(task.createdAt).toLocaleDateString("zh-CN")}</span>
            </div>
            {task.updatedAt && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={14} />
                <span>更新于 {new Date(task.updatedAt).toLocaleDateString("zh-CN")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-200 dark:border-zinc-700">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors w-full"
          >
            <Trash2 size={16} />
            删除任务
          </button>
        </div>
      </div>
    </Resizable>
  );
}
