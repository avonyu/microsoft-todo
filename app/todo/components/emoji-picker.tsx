import config from "@/app/todo/config.json";

const EMOJI_LIST = (config as unknown as { emoji_list: string[] }).emoji_list;

export function EmojiPicker({
  onSelect,
}: {
  onSelect: (emoji: string) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-1 p-2">
      {EMOJI_LIST.map((e: string) => (
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