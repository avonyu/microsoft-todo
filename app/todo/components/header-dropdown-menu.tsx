"use client";

import {
  Ellipsis,
  ArrowUpDown,
  Star,
  Sun,
  CalendarPlus,
  CalendarDays,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useTodo } from "@/contexts/todo-context";
import config from "@/app/todo/lib/config.json";
import { cn } from "@/lib/utils";

const BG_CONFIG = config.bg_config;
const DEFAULT_SET_IDS = [
  "myday",
  "important",
  "planned",
  "assigned_to_me",
  "flagged",
  "inbox",
];

interface HeaderDropdownMenuProps {
  setId: string;
}

export function HeaderDropdownMenu({ setId }: HeaderDropdownMenuProps) {
  const { actions } = useTodo();

  const handleSetBackground = async (bgId: string, bgValue: string) => {
    // Store bgId in local state (will be persisted to localStorage)
    actions.setSetBgImage(setId, bgId);

    // Only sync to database for custom sets (not default sets)
    if (!DEFAULT_SET_IDS.includes(setId)) {
      await actions.updateTodoSetOptimistic(setId, { bgImg: bgId });
    }
  };

  return (
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
            <div className="text-gray-700 dark:text-gray-200 text-sm px-2">
              主题
            </div>
            <div className="p-2">
              <div className="grid grid-cols-5 gap-2">
                {BG_CONFIG.map((bg) => (
                  <div
                    key={bg.id}
                    onClick={() => handleSetBackground(bg.id, bg.value)}
                    className={cn(
                      "size-8 cursor-pointer hover:ring-1 hover:ring-gray-500",
                      bg.type === "color" ? "" : "bg-cover bg-center",
                    )}
                    style={{
                      backgroundColor:
                        bg.type === "color" ? bg.value : undefined,
                      backgroundImage:
                        bg.type === "image" ? `url(${bg.value})` : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}