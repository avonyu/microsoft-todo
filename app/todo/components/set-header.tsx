"use client";

import { cloneElement, useState, useEffect } from "react";
import { SmilePlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTodo } from "@/contexts/todo-context";
import { EmojiPicker } from "./emoji-picker";
import { HeaderDropdownMenu } from "./header-dropdown-menu";

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
    <div className="flex items-center justify-between py-6">
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

  useEffect(() => {
    if (isCustomSet) {
      const todoSet = state.sets.find((s) => s.id === setId);
      if (todoSet) {
        setCurrentEmoji(todoSet.emoji || "");
      }
    }
  }, [isCustomSet, setId, state.sets]);

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

  return (
    <div className="flex items-center justify-between py-6">
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
                  <span className="text-3xl cursor-pointer">{currentEmoji}</span>
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

        <h1 className="text-white text-3xl p-1 font-semibold">
          {label}
        </h1>
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
