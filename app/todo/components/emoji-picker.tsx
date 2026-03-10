import config from "@/app/todo/lib/config.json";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJI_LIST = (config as unknown as { emoji_list: string[] }).emoji_list;

export function EmojiPicker({
  onSelect,
  onDelete,
  showDelete = false,
}: {
  onSelect: (emoji: string) => void;
  onDelete?: () => void;
  showDelete?: boolean;
}) {
  return (
    <div>
      <div
        className={cn(
          "grid grid-cols-6 gap-1 p-2 max-h-52 overflow-y-auto",
          "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full",
          "dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600",
        )}
      >
        {EMOJI_LIST.map((e: string) => (
          <div
            key={e}
            onClick={() => onSelect(e)}
            className={cn(
              "cursor-pointer p-1 text-lg rounded",
              "hover:bg-gray-100 dark:hover:bg-zinc-700",
            )}
          >
            {e}
          </div>
        ))}
      </div>
      {showDelete && onDelete && (
        <div className="p-0.5">
          <button
            onClick={onDelete}
            className={cn(
              "w-full flex items-center justify-center gap-2 p-2",
              "text-sm text-blue-600 font-bold rounded-xs transition-colors",
              "hover:bg-gray-50 dark:hover:bg-gray-200/20",
            )}
          >
            清除
          </button>
        </div>
      )}
    </div>
  );
}
