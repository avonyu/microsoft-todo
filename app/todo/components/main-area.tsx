"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Plus, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import TaskItem from "./task-item";
import { createTodoTask } from "@/lib/actions/todo/todo-actions";
import reorder from "@/lib/utils/reorder";
import { useTodo } from "@/contexts/todo-context";
import SetCard from "./set-card";
import { defaultTodoSet, type DefaultSet } from "../lib/default-sets";
import { SetHeader } from "./set-header";
import { TaskDetailSidebar } from "./task-detail-sidebar";
import config from "@/app/todo/lib/config.json";

// Default background for custom sets
const DEFAULT_BG = "#788cde";

// Build a map from bg id to bg value for quick lookup
const BG_ID_TO_VALUE = config.bg_config.reduce((acc, bg) => {
  acc[bg.id] = bg.value;
  return acc;
}, {} as Record<string, string>);

// Check if setId is a default system set
function isDefaultSet(setId: string): boolean {
  return ["myday", "important", "planned", "assigned_to_me", "flagged", "inbox"].includes(setId);
}

function MainArea() {
  const params = useParams();
  const setId = params.setId as string;

  const { state, actions, selectors } = useTodo();
  const { isTaskDetailOpen, selectedTaskId } = state;
  const currentSet = selectors.getTodoSetById(setId) || defaultTodoSet[0];
  const tasks = selectors.getTasksBySetId(setId);

  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // 检查点击是否在 header 区域（避免干扰 header 的编辑功能）
  const isClickOnHeader = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    return target.closest('[data-header-area]') !== null;
  };

  // Get background image - use setBgImages[setId] if set, otherwise use set's bgImg or default
  // bgValue could be either bg.id (e.g., "#788cde" or "bg-1") or a direct value
  const rawBgValue = state.setBgImages?.[setId] || currentSet.bgImg || DEFAULT_BG;

  // Convert bg id to actual value if needed
  const bgValue = BG_ID_TO_VALUE[rawBgValue] || rawBgValue;

  // Determine if background is a color or image
  const isColorBackground = bgValue.startsWith("#");
  const bgImage = isColorBackground ? undefined : bgValue;
  const bgColor = isColorBackground ? bgValue : undefined;

  // Determine if this set allows task creation
  const canCreateTask = !["assigned_to_me", "flagged"].includes(setId);

  // Handle creating a new task
  const handleCreateTodo = async (formData: FormData) => {
    if (!state.user?.id) return;
    const content = formData.get("content") as string;
    if (!content.trim()) return;

    // Add setId for custom sets
    if (!isDefaultSet(setId)) {
      formData.set("setId", setId);
    }

    const res = await createTodoTask(state.user.id, formData);

    if (res.success && res.data) {
      actions.addTask(res.data);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  // Reorder tasks for display
  const orderedTasks = reorder(tasks);

  // Determine if we should show the hint card
  const showHintCard = orderedTasks.length === 0 && "card" in currentSet && currentSet.card;

  return (
    <div className="flex h-full w-full min-w-0">

      <main
        onMouseDown={(e) => {
          if (isClickOnHeader(e)) return;
          if (isInputFocused && e.target !== inputRef.current) {
            e.preventDefault();
          }
        }}
        onClick={(e) => {
          if (isClickOnHeader(e)) return;
          inputRef.current?.focus();
        }}
        className={cn(
          "flex-1 min-w-0 rounded-tl-md overflow-hidden transition-all duration-300 ease-in-out",
          !isColorBackground && "bg-cover bg-center",
        )}
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
          backgroundColor: bgColor,
        }}
      >
        <div className="flex flex-col px-12 h-full">
          {/* Header */}
          <SetHeader
            setId={currentSet.id}
            label={currentSet.label}
            icon={"icon" in currentSet ? currentSet.icon : null}
          />

          {/* Task list */}
          <div
            className={cn(
              "flex-1 py-1 flex flex-col space-y-0.5 overflow-y-auto relative",
              orderedTasks.length === 0 && "items-center justify-center",
              "scrollbar-thin",
            )}
          >
            {orderedTasks.map((task) => (
              <TaskItem task={task} key={task.id} currentSetId={setId} bgColor={bgColor} />
            ))}

            {/* Hint card for empty state */}
            {showHintCard && (
              <SetCard todoSet={currentSet as DefaultSet} />
            )}
          </div>

          {/* Add task input */}
          <div className="mt-2 h-20">
            {canCreateTask && (
              <div
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-3 border-0 bg-white/70 backdrop-blur text-gray-600 rounded text-sm hover:bg-white/80",
                  "dark:text-white dark:bg-zinc-800/70 dark:hover:bg-zinc-700/70",
                )}
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <Circle
                    size={20}
                    strokeWidth={2}
                    className={cn(
                      "absolute text-gray-800 dark:text-white pointer-events-none transition-all duration-200 transform",
                      isInputFocused ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <Plus
                    size={20}
                    strokeWidth={2}
                    className={cn(
                      "absolute text-gray-800 dark:text-white transition-all duration-200 transform",
                      isInputFocused ? "opacity-0" : "opacity-100",
                    )}
                  />
                </div>
                <form action={handleCreateTodo} className="flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    name="content"
                    placeholder="添加任务"
                    className={cn(
                      "w-full bg-transparent text-black dark:text-white",
                      "placeholder:text-gray-800 dark:placeholder:text-white",
                      "focus:outline-none focus:placeholder-transparent dark:focus:placeholder-transparent",
                    )}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                  />
                  {/* Hidden fields for special sets */}
                  {setId === "myday" && (
                    <input type="hidden" name="isToday" value="true" />
                  )}
                  {setId === "important" && (
                    <input type="hidden" name="isImportant" value="true" />
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Task Detail Sidebar */}
      {isTaskDetailOpen && selectedTaskId && (
        <TaskDetailSidebar
          taskId={selectedTaskId}
          onClose={actions.closeTaskDetail}
          bgColor={bgColor}
        />
      )}
    </div>
  );
}

export default MainArea;
