"use client";

import { cloneElement, useState, useEffect } from "react";
import {
  Ellipsis,
  ArrowUpDown,
  Star,
  Calendar,
  Sun,
  CalendarPlus,
  CalendarDays,
  Palette,
  SmilePlus,
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
const EMOJI_LIST = config.emoji_list;

export function EmojiPicker({
  onSelect,
}: {
  onSelect: (emoji: string) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-1 p-2">
      {EMOJI_LIST.map((e) => (
        <div
          key={e}
          onClick={() => onSelect(e)}
          className="cursor-pointer p-1 text-lg hover:bg-gray-100 dark:hover:bg-zinc-700 rounded"
        >
          {e}
        </div>
      ))}
    </div>
  );
}

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
const DEFAULT_SET_IDS = ["myday", "important", "planned", "assigned_to_me", "flagged", "inbox"];

function StandardSetHeader({
  label,
  icon,
  setId,
}: {
  label: string;
  icon?: React.ReactNode;
  setId: string;
}) {
  const { actions, selectors, state } = useTodo();
  const tasks = selectors.getTasksBySetId(setId);
  const isCustomSet = !DEFAULT_SET_IDS.includes(setId);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(label);
  const [currentEmoji, setCurrentEmoji] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Get current set data for custom sets
  useEffect(() => {
    if (isCustomSet) {
      const todoSet = state.sets.find((s) => s.id === setId);
      if (todoSet) {
        setCurrentEmoji(todoSet.emoji || "");
        setEditName(todoSet.name || label);
      }
    }
  }, [isCustomSet, setId, state.sets, label]);

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

  const handleTitleClick = () => {
    if (isCustomSet && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    const trimmedName = editName.trim();
    if (trimmedName) {
      await actions.updateTodoSetOptimistic(setId, { name: trimmedName, emoji: currentEmoji });
    }
    setIsEditing(false);
  };

  const handleEmojiSelect = async (emoji: string) => {
    setCurrentEmoji(emoji);
    await actions.updateTodoSetOptimistic(setId, { name: editName.trim() || label, emoji });
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-center">
        {isEditing ? (
          <div className="flex items-center gap-2">
            {showEmojiPicker && (
              <div className="absolute top-16 z-50 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border">
                <EmojiPicker onSelect={handleEmojiSelect} />
              </div>
            )}
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") {
                  setEditName(label);
                  setIsEditing(false);
                }
              }}
              className="bg-transparent border-b-2 border-white text-white text-3xl font-semibold ml-2 focus:outline-none"
              autoFocus
            />
          </div>
        ) : (
          <>
            {currentEmoji && <span className="text-3xl">{currentEmoji}</span>}
            <h1
              className={`text-white text-3xl p-1 font-semibold ml-2 ${isCustomSet ? "cursor-pointer hover:bg-white/20 rounded-sm" : ""}`}
              onClick={handleTitleClick}
            >
              {label}
            </h1>
            {isCustomSet && (
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="ml-2 p-1 text-white hover:bg-white/20 rounded-md"
              >
                <SmilePlus className="h-5 w-5" />
              </button>
            )}
            {showEmojiPicker && isCustomSet && !isEditing && (
              <div className="absolute top-16 z-50 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border">
                <EmojiPicker onSelect={handleEmojiSelect} />
              </div>
            )}
          </>
        )}
        {icon && !isEditing && !isCustomSet &&
          cloneElement(
            icon as React.ReactElement<{ size?: number; className?: string }>,
            {
              size: 24,
              className: "text-white",
            },
          )}
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
