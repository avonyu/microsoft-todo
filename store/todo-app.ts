import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import type { TodoTask, TodoSet, User } from '@/lib/types/prisma-types'
import { getAllTodoTasks } from '@/lib/actions/todo/todo-actions'
import { getAllTodoSets } from '@/lib/actions/todo/todoset-actions'
import { getUserPreferences } from '@/lib/actions/user/user-preferences'
import { updateSetBgImage } from '@/lib/actions/user/user-preferences'
import { defaultTodoSet, type DefaultSet, type TodoSetDisplay } from '@/app/todo/lib/default-sets'

// 智能列表设置类型
interface SmartListSettings {
  smartListImportant: boolean
  smartListPlanned: boolean
  smartListCompleted: boolean
  smartListAll: boolean
  smartListAssigned: boolean
  autoHideEmptySmartLists: boolean
  showTodayTasks: boolean
}

// 定义状态类型
interface TodoAppState {
  user: User | undefined
  tasks: TodoTask[]
  sets: TodoSet[]
  isLoading: boolean
  error: string | null
  setBgImages: Record<string, string>
  smartListSettings: SmartListSettings
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
  setSetBgImage: (setId: string, bgImg: string) => void
  updateSmartListSetting: (key: keyof SmartListSettings, value: boolean) => void
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
        setBgImages: {},
        smartListSettings: {
          smartListImportant: true,
          smartListPlanned: true,
          smartListCompleted: true,
          smartListAll: false,
          smartListAssigned: true,
          autoHideEmptySmartLists: false,
          showTodayTasks: true,
        },

        // Actions - 直接在顶层，不嵌套
        setUser: (user) => set({ user }, false, 'setUser'),

        fetchInitialData: async (userId: string) => {
          set({ isLoading: true, error: null }, false, 'fetchInitialData/start')
          try {
            const [tasksRes, setsRes, preferencesRes] = await Promise.all([
              getAllTodoTasks(userId),
              getAllTodoSets(userId),
              getUserPreferences(userId)
            ])

            const newTasks = tasksRes.success && tasksRes.data ? tasksRes.data : []
            const newSets = setsRes.success && setsRes.data ? setsRes.data : []

            // Extract bgImg from sets and populate setBgImages for database sync
            const bgImages: Record<string, string> = {}
            newSets.forEach((set) => {
              if (set.bgImg) {
                bgImages[set.id] = set.bgImg
              }
            })

            // Merge setBgImages from user preferences (database) - these take priority
            if (preferencesRes.success && preferencesRes.data?.setBgImages) {
              Object.entries(preferencesRes.data.setBgImages).forEach(([setId, bgImg]) => {
                bgImages[setId] = bgImg
              })
            }

            set({
              tasks: newTasks,
              sets: newSets,
              setBgImages: bgImages,
              isLoading: false
            }, false, 'fetchInitialData/success')
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
        setSetBgImage: async (setId, bgImg) => {
          // First update local state
          set((state) => ({
            setBgImages: { ...state.setBgImages, [setId]: bgImg }
          }), false, 'setSetBgImage')

          // Then sync to database if user is logged in
          const userId = useTodoAppStore.getState().user?.id
          if (userId) {
            await updateSetBgImage(userId, setId, bgImg)
          }
        },

        updateSmartListSetting: (key, value) => set(
          (state) => ({
            smartListSettings: { ...state.smartListSettings, [key]: value }
          }),
          false,
          'updateSmartListSetting'
        ),
      }),
      {
        name: 'todo-app-storage',
        partialize: (state) => ({
          user: state.user,
          tasks: state.tasks,
          sets: state.sets,
          setBgImages: state.setBgImages,
          smartListSettings: state.smartListSettings,
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
export const useGetSelectedBgImg = () => useTodoAppStore((state) => state.setBgImages)
export const useGetBgImgBySetId = (setId: string) => useTodoAppStore((state) => state.setBgImages[setId])
export const useGetSmartListSettings = () => useTodoAppStore((state) => state.smartListSettings)

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
  setSetBgImage: state.setSetBgImage,
  updateSmartListSetting: state.updateSmartListSetting,
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
        return state.tasks.filter((t) => t.setId === null);
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
        return state.tasks.filter((t) => t.setId === null && t.userId === state.user?.id).length;
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
        emoji: customSet.emoji,
      };
    }
    return defaultTodoSet[0];
  }))
