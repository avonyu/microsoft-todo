import { type TodoTask } from "@/generated/prisma/client";

/**
 * 对任务列表进行排序，优先级：isImportant (desc) -> updatedAt (desc)
 * @param tasks - 待排序的任务列表
 * @returns 排序后的任务列表
 */
export default function reorder(
  tasks: TodoTask[],
) {
  const sortedTasks = [...tasks];

  // 排序：isImportant (desc) -> updatedAt (desc)
  sortedTasks.sort((a, b) => {
    // 优先级 1: isImportant
    if (a.isImportant !== b.isImportant) {
      return a.isImportant ? -1 : 1; // true (-1) 排在前面
    }

    // 优先级 2: updatedAt
    const timeA = new Date(a.updatedAt).getTime();
    const timeB = new Date(b.updatedAt).getTime();

    // 优先级 3：isFinish (asc)
    if (a.isFinish !== b.isFinish) {
      return a.isFinish ? 1 : -1; // false (-1) 排在前面
    }

    return timeB - timeA; // 大的时间（较新）排在前面
  });

  return sortedTasks;
}
