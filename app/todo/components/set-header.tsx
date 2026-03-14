"use client";

import { cloneElement, useState, useEffect, useRef } from "react";
import { SmilePlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTodo } from "@/contexts/todo-context";
import { EmojiPicker } from "./emoji-picker";
import { HeaderDropdownMenu } from "./header-dropdown-menu";
import { cn } from '@/lib/utils'

interface SetHeaderProps {
  setId: string;
  label: string;
  icon?: React.ReactNode;
}

/**
 * Header component for "My Day" set with date display
 */
function MyDayHeader({ label, setId }: { label: string; setId: string }) {
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
    <div className="flex items-center justify-between py-6" data-header-area>
      <div>
        <h1 className="text-white text-3xl font-semibold ml-2">{label}</h1>
        <p className="text-white text-sm font-medium ml-2">{getData()}</p>
      </div>
      <HeaderDropdownMenu setId={setId} />
    </div>
  );
}

/**
 * Header component for standard sets with icon
 */
const DEFAULT_SET_IDS = [
  "myday",
  "important",
  "planned",
  "assigned_to_me",
  "flagged",
  "inbox",
];

function StandardSetHeader({
  label,
  icon,
  setId,
}: {
  label: string;
  icon?: React.ReactNode;
  setId: string;
}) {
  const { actions, state } = useTodo();
  const isCustomSet = !DEFAULT_SET_IDS.includes(setId);

  const [currentEmoji, setCurrentEmoji] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const [inputWidth, setInputWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // 计算文本宽度
  const text = isEditing ? editValue : label;
  useEffect(() => {
    if (measureRef.current) {
      const width = measureRef.current.offsetWidth;
      setInputWidth(width);
    }
  }, [text]);

  useEffect(() => {
    if (isCustomSet) {
      const todoSet = state.sets.find((s) => s.id === setId);
      if (todoSet) {
        setCurrentEmoji(todoSet.emoji || "");
      }
    }
  }, [isCustomSet, setId, state.sets]);

  // 同步 label 变化到 editValue
  useEffect(() => {
    setEditValue(label);
  }, [label]);

  // 自动聚焦并全选
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEmojiSelect = async (emoji: string) => {
    setCurrentEmoji(emoji);
    await actions.updateTodoSetOptimistic(setId, {
      name: label,
      emoji,
    });
    setShowEmojiPicker(false);
  };

  const handleEmojiDelete = async () => {
    setCurrentEmoji("");
    await actions.updateTodoSetOptimistic(setId, {
      name: label,
      emoji: "",
    });
    setShowEmojiPicker(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(label);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue(label);
  };

  const handleSaveEdit = async () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== label) {
      await actions.updateTodoSetOptimistic(setId, {
        name: trimmedValue,
        emoji: currentEmoji,
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="flex items-center justify-between py-6" data-header-area>
      <div className="flex items-center group">
        {icon && !isCustomSet && cloneElement(
          icon as React.ReactElement<{ size?: number; className?: string }>,
          {
            size: 24,
            className: "text-white",
          },
        )}

        {isCustomSet && (
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <button className="text-white hover:bg-white/20 rounded-xs">
                {currentEmoji ? (
                  <span className="text-2xl cursor-pointer">{currentEmoji}</span>
                ) : (
                  <SmilePlus className="size-8 p-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <EmojiPicker onSelect={handleEmojiSelect} onDelete={handleEmojiDelete} showDelete={!!currentEmoji} />
            </PopoverContent>
          </Popover>
        )}

        <input
          ref={inputRef}
          type="text"
          value={isEditing ? editValue : label}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveEdit}
          onClick={isCustomSet && !isEditing ? handleStartEdit : undefined}
          readOnly={!isEditing}
          style={{ width: inputWidth ? `${inputWidth}px` : 'auto' }}
          className={cn(
            "text-white text-2xl shadow-none font-semibold bg-transparent dark:bg-transparent rounded-sm pl-2 ring-0 focus-visible:ring-0 h-10 cursor-default selection:bg-blue-500 leading-none outline-none",
            isEditing && "bg-white text-black dark:text-white border-x border-t border-b-2 border-b-sky-600 dark:border-gray-400/40 dark:border-b-sky-400",
            isCustomSet && !isEditing && "hover:bg-gray-200/20 dark:hover:bg-zinc-800/60 cursor-pointer"
          )}
        />

        {/* 隐藏的测量元素 */}
        <span
          ref={measureRef}
          className="text-white text-2xl font-semibold p-2 invisible absolute"
          aria-hidden="true"
        >
          {text}
        </span>
      </div>

      <HeaderDropdownMenu setId={setId} />
    </div>
  );
}

/**
 * SetHeader renders the appropriate header variant based on setId.
 * Uses explicit variants instead of conditional rendering in the parent component.
 */
export function SetHeader({ setId, label, icon }: SetHeaderProps) {
  if (setId === "myday") {
    return <MyDayHeader label={label} setId={setId} />;
  }
  return <StandardSetHeader label={label} icon={icon} setId={setId} />;
}

export default SetHeader;
