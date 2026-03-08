"use client";

import { cloneElement } from "react";
import {
  Ellipsis,
  ArrowUpDown,
  Star,
  Calendar,
  Sun,
  CalendarPlus,
  CalendarDays,
  Palette,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTodo } from "@/contexts/todo-context";
import {
  deleteTodoTask,
  changeTodoTask,
} from "@/lib/actions/todo/todo-actions";
import { cn } from "@/lib/utils";
import config from "@/app/todo/config.json"

const BG_CONFIG = config.bg_config

interface SetHeaderProps {
  setId: string;
  label: string;
  icon?: React.ReactNode;
}

/**
 * Header component for "My Day" set with date display
 */
function MyDayHeader({ label }: { label: string }) {
  const getData = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const week = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    return `${month}月${day}日，${week[date.getDay()]}`;
  };

  return (
    <div className="py-6">
      <h1 className="text-white text-3xl font-semibold ml-2">{label}</h1>
      <p className="text-white text-sm font-medium ml-2">{getData()}</p>
    </div>
  );
}

/**
 * Header component for standard sets with icon
 */
function StandardSetHeader({
  label,
  icon,
  setId,
}: {
  label: string;
  icon?: React.ReactNode;
  setId: string;
}) {
  const { actions, selectors } = useTodo();
  const tasks = selectors.getTasksBySetId(setId);

  const handleDelete = async (taskId: string) => {
    const res = await deleteTodoTask(taskId);
    if (res.success) {
      actions.deleteTask(taskId);
    }
  };

  const handleToggleImportant = async (
    taskId: string,
    isImportant: boolean,
  ) => {
    const res = await changeTodoTask(taskId, { isImportant });
    if (res.success && res.data) {
      actions.updateTask(res.data);
    }
  };

  const handleAddToMyDay = async (taskId: string) => {
    const res = await changeTodoTask(taskId, { isToday: true });
    if (res.success && res.data) {
      actions.updateTask(res.data);
    }
  };

  const handleSetBackground = (bgValue: string) => {
    actions.setSetBgImage(setId, bgValue);
  };

  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-center">
        {icon &&
          cloneElement(
            icon as React.ReactElement<{ size?: number; className?: string }>,
            {
              size: 24,
              className: "text-white",
            },
          )}
        <h1 className="text-white text-3xl font-semibold ml-2">{label}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-center text-white hover:bg-white/20 hover:dark:bg-black/20 rounded-md size-8">
            <Ellipsis className="h-5 w-5" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
              <ArrowUpDown className="h-4 w-4" />
              <span>排序依据</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Star className="h-4 w-4" />
                <span>重要性</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <CalendarDays className="h-4 w-4" />
                <span>到期日期</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Sun className="h-4 w-4" />
                <span>已添加到"我的一天"</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <ArrowUpDown className="h-4 w-4" />
                <span>字母顺序</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <CalendarPlus className="h-4 w-4" />
                <span>创建日期</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <div>
              <div className="text-gray-200 text-sm px-2">主题</div>
              <div className="p-2">
                <div className="grid grid-cols-5 gap-2">
                  {BG_CONFIG.map((bg) => (
                    <div
                      key={bg.id}
                      onClick={() => handleSetBackground(bg.value)}
                      className={cn(
                        "size-8 cursor-pointer hover:ring-1 hover:ring-gray-500",
                        bg.type === "color" ? "" : "bg-cover bg-center"
                      )}
                      style={{
                        backgroundColor: bg.type === "color" ? bg.value : undefined,
                        backgroundImage: bg.type === "image" ? `url(${bg.value})` : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/**
 * SetHeader renders the appropriate header variant based on setId.
 * Uses explicit variants instead of conditional rendering in the parent component.
 */
export function SetHeader({ setId, label, icon }: SetHeaderProps) {
  if (setId === "myday") {
    return <MyDayHeader label={label} />;
  }
  return <StandardSetHeader label={label} icon={icon} setId={setId} />;
}

export default SetHeader;
