import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import type { TodoTask, TodoSet, User } from '@/generated/prisma/client'
import { getAllTodoTasks } from '@/lib/actions/todo/todo-actions'
import { getAllTodoSets } from '@/lib/actions/todo/todoset-actions'
import { defaultTodoSet, type DefaultSet } from '@/app/todo/config'

// 定义显示用的类型，解决 icon 类型不兼容问题
// 使用与 DefaultSet 相同的 icon 类型以保持兼容性
interface TodoSetDisplay extends Omit<DefaultSet, 'icon' | 'bgImg'> {
  id: string
  label: string
  icon: React.JSX.Element | null
  bgImg: string | BgColor
  count?: number
  card?: Card
}

interface Card {
  img: string
  title: string | undefined
  content: string
}

type BgColor = "darkblue" | "darkpink" | "darkred" | "darkorange" | "darkgreen" | "darkteal" | "darkgray" | "blue" | "pink" | "red" | "orange" | "green" | "teal" | "gray"

// 定义状态类型
interface TodoAppState {
  user: User | undefined
  tasks: TodoTask[]
  sets: TodoSet[]
  isLoading: boolean
  error: string | null
}

// 定义操作类型
interface TodoAppActions {
  setUser: (user: User | undefined) => void
  fetchInitialData: (userId: string) => Promise<void>
  addTask: (newTask: TodoTask) => void
  deleteTask: (taskId: string) => void
  updateTask: (newTask: TodoTask) => void
  addSet: (newSet: TodoSet) => void
  deleteSet: (setId: string) => void
  updateSet: (newSet: TodoSet) => void
  clearError: () => void
}

type TodoAppStore = TodoAppState & TodoAppActions

export const useTodoAppStore = create<TodoAppStore>()(
  devtools(
    persist(
      (set) => ({
        // State
        user: undefined,
        tasks: [],
        sets: [],
        isLoading: false,
        error: null,

        // Actions - 直接在顶层，不嵌套
        setUser: (user) => set({ user }, false, 'setUser'),

        fetchInitialData: async (userId: string) => {
          set({ isLoading: true, error: null }, false, 'fetchInitialData/start')
          try {
            const [tasksRes, setsRes] = await Promise.all([
              getAllTodoTasks(userId),
              getAllTodoSets(userId)
            ])

            const newTasks = tasksRes.success && tasksRes.data ? tasksRes.data : []
            const newSets = setsRes.success && setsRes.data ? setsRes.data : []

            set({ tasks: newTasks, sets: newSets, isLoading: false }, false, 'fetchInitialData/success')
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data'
            set({ error: errorMessage, isLoading: false }, false, 'fetchInitialData/error')
          }
        },

        addTask: (newTask: TodoTask) => set(
          (state) => ({ tasks: [...state.tasks, newTask] }),
          false,
          'addTask'
        ),

        deleteTask: (taskId: string) => set(
          (state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) }),
          false,
          'deleteTask'
        ),

        updateTask: (newTask: TodoTask) => set(
          (state) => ({ tasks: state.tasks.map((t) => t.id === newTask.id ? newTask : t) }),
          false,
          'updateTask'
        ),

        addSet: (newSet: TodoSet) => set(
          (state) => ({ sets: [...state.sets, newSet] }),
          false,
          'addSet'
        ),

        deleteSet: (setId: string) => set(
          (state) => ({ sets: state.sets.filter((s) => s.id !== setId) }),
          false,
          'deleteSet'
        ),

        updateSet: (newSet: TodoSet) => set(
          (state) => ({ sets: state.sets.map((s) => s.id === newSet.id ? newSet : s) }),
          false,
          'updateSet'
        ),

        clearError: () => set({ error: null }, false, 'clearError'),
      }),
      {
        name: 'todo-app-storage',
        partialize: (state) => ({
          user: state.user,
          tasks: state.tasks,
          sets: state.sets
        }),
        storage: createJSONStorage(() => localStorage),
      }
    ),
    { name: 'TodoAppStore' }
  )
)

// Selectors - 使用 useShallow 优化参数化 selector
import { useShallow } from 'zustand/react/shallow'

export const useGetUser = () => useTodoAppStore((state) => state.user)
export const useGetTasks = () => useTodoAppStore((state) => state.tasks)
export const useGetSets = () => useTodoAppStore((state) => state.sets)
export const useIsLoading = () => useTodoAppStore((state) => state.isLoading)
export const useGetError = () => useTodoAppStore((state) => state.error)

// 向后兼容：保留 useTodoActions 用于获取 actions
export const useTodoActions = () => useTodoAppStore(useShallow((state) => ({
  setUser: state.setUser,
  fetchInitialData: state.fetchInitialData,
  addTask: state.addTask,
  deleteTask: state.deleteTask,
  updateTask: state.updateTask,
  addSet: state.addSet,
  deleteSet: state.deleteSet,
  updateSet: state.updateSet,
  clearError: state.clearError,
})))

// 参数化 selector - 使用 useShallow 避免不必要的重新渲染
export const useGetTaskById = (taskId: string) =>
  useTodoAppStore(useShallow((state) => state.tasks.find((task) => task.id === taskId)))

export const useGetTasksBySetId = (setId: string) =>
  useTodoAppStore(useShallow((state) => {
    switch (setId) {
      case "myday":
        return state.tasks.filter((t) => t.isToday);
      case "important":
        return state.tasks.filter((t) => t.isImportant);
      case "planned":
        return state.tasks.filter((t) => t.dueDate !== null);
      case "assigned_to_me":
        return [];
      case "flagged":
        return [];
      case "inbox":
        return state.tasks;
      default:
        return state.tasks.filter((t) => t.setId === setId);
    }
  }))

export const useGetCountBySetId = (setId: string) =>
  useTodoAppStore(useShallow((state) => {
    switch (setId) {
      case "myday":
        return state.tasks.filter((t) => t.isToday).length;
      case "important":
        return state.tasks.filter((t) => t.isImportant).length;
      case "planned":
        return state.tasks.filter((t) => t.dueDate !== null).length;
      case "inbox":
        return state.tasks.filter((t) => t.userId === state.user?.id).length;
      default:
        return state.tasks.filter((t) => t.setId === setId).length;
    }
  }));

// 使用专门的 Display 类型解决类型不兼容问题
export const useGetTodoSetById = (setId: string): TodoSetDisplay | DefaultSet =>
  useTodoAppStore(useShallow((state) => {
    const defaultSet = defaultTodoSet.find(s => s.id === setId);
    if (defaultSet) return defaultSet;

    const customSet = state.sets.find(s => s.id === setId);
    if (customSet) {
      return {
        id: customSet.id,
        label: customSet.name,
        icon: null,
        bgImg: customSet.bgImg || '',
      };
    }
    return defaultTodoSet[0];
  }))
