"use client";

import { createContext, useContext, ReactNode, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  useTodoAppStore,
  useGetUser,
  useGetTasks,
  useGetSets,
  useIsLoading,
  useGetError,
  useGetTasksBySetId,
  useGetTodoSetById,
  useGetCountBySetId,
} from "@/store/todo-app";
import type { User, TodoTask, TodoSet } from "@/generated/prisma/client";
import { defaultTodoSet, type DefaultSet } from "@/app/todo/config";
import {
  changeTodoTask,
  deleteTodoTask,
} from "@/lib/actions/todo/todo-actions";

// Types for the context
interface TodoState {
  user: User | undefined;
  tasks: TodoTask[];
  sets: TodoSet[];
  isLoading: boolean;
  error: string | null;
}

interface TodoActions {
  setUser: (user: User | undefined) => void;
  fetchInitialData: (userId: string) => Promise<void>;
  addTask: (newTask: TodoTask) => void;
  updateTask: (newTask: TodoTask) => void;
  deleteTask: (taskId: string) => void;
  addSet: (newSet: TodoSet) => void;
  updateSet: (newSet: TodoSet) => void;
  deleteSet: (setId: string) => void;
  clearError: () => void;
  // Optimistic actions
  toggleTaskImportant: (taskId: string) => Promise<void>;
  toggleTaskFinish: (taskId: string) => Promise<void>;
  toggleTaskToday: (taskId: string) => Promise<void>;
  deleteTaskOptimistic: (taskId: string) => Promise<void>;
}

interface TodoSelectors {
  getTasksBySetId: (setId: string) => TodoTask[];
  getTodoSetById: (setId: string) => TodoSetDisplay | DefaultSet;
  getCountBySetId: (setId: string) => number;
}

interface TodoContextValue {
  state: TodoState;
  actions: TodoActions;
  selectors: TodoSelectors;
}

// Display type for TodoSet (solves icon type incompatibility)
interface TodoSetDisplay extends Omit<DefaultSet, "icon" | "bgImg"> {
  id: string;
  label: string;
  icon: React.JSX.Element | null;
  bgImg: string;
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  // Track pending operations to prevent race conditions
  const pendingOperations = useRef(new Set<string>());

  // Get state from Zustand store
  const state = useTodoAppStore(useShallow((s) => ({
    user: s.user,
    tasks: s.tasks,
    sets: s.sets,
    isLoading: s.isLoading,
    error: s.error,
  })));

  // Get actions from Zustand store (use getState() for async operations)
  const storeActions = useTodoAppStore(useShallow((s) => ({
    setUser: s.setUser,
    fetchInitialData: s.fetchInitialData,
    addTask: s.addTask,
    updateTask: s.updateTask,
    deleteTask: s.deleteTask,
    addSet: s.addSet,
    updateSet: s.updateSet,
    deleteSet: s.deleteSet,
    clearError: s.clearError,
  })));

  // Helper to get fresh state in async functions (prevents stale closure)
  const getFreshTask = (taskId: string): TodoTask | undefined => {
    return useTodoAppStore.getState().tasks.find((t) => t.id === taskId);
  };

  // Optimistic actions that handle UI updates and server sync
  const toggleTaskImportant = async (taskId: string) => {
    // Prevent concurrent operations on the same task
    if (pendingOperations.current.has(taskId)) return;
    pendingOperations.current.add(taskId);

    // Use getState() to get fresh data, avoiding stale closure
    const task = getFreshTask(taskId);
    if (!task) {
      pendingOperations.current.delete(taskId);
      return;
    }

    const originalTask = { ...task };
    const newIsImportant = !task.isImportant;
    const optimisticTask: TodoTask = {
      ...task,
      isImportant: newIsImportant,
      updatedAt: new Date(),
    };

    // Optimistic update
    storeActions.updateTask(optimisticTask);

    // Server update
    const res = await changeTodoTask(taskId, { isImportant: newIsImportant });
    if (res.success && res.data) {
      storeActions.updateTask(res.data);
    } else {
      // Rollback on failure
      storeActions.updateTask(originalTask);
      console.error('Failed to toggle task importance:', res.message);
    }

    pendingOperations.current.delete(taskId);
  };

  const toggleTaskFinish = async (taskId: string) => {
    // Prevent concurrent operations on the same task
    if (pendingOperations.current.has(taskId)) return;
    pendingOperations.current.add(taskId);

    // Use getState() to get fresh data, avoiding stale closure
    const task = getFreshTask(taskId);
    if (!task) {
      pendingOperations.current.delete(taskId);
      return;
    }

    const originalTask = { ...task };
    const newIsFinish = !task.isFinish;
    const optimisticTask: TodoTask = {
      ...task,
      isFinish: newIsFinish,
      updatedAt: new Date(),
    };

    // Optimistic update
    storeActions.updateTask(optimisticTask);

    // Server update
    const res = await changeTodoTask(taskId, { isFinish: newIsFinish });
    if (res.success && res.data) {
      storeActions.updateTask(res.data);
    } else {
      // Rollback on failure
      storeActions.updateTask(originalTask);
      console.error('Failed to toggle task finish status:', res.message);
    }

    pendingOperations.current.delete(taskId);
  };

  const toggleTaskToday = async (taskId: string) => {
    // Prevent concurrent operations on the same task
    if (pendingOperations.current.has(taskId)) return;
    pendingOperations.current.add(taskId);

    // Use getState() to get fresh data, avoiding stale closure
    const task = getFreshTask(taskId);
    if (!task) {
      pendingOperations.current.delete(taskId);
      return;
    }

    const originalTask = { ...task };
    const newIsToday = !task.isToday;
    const optimisticTask: TodoTask = {
      ...task,
      isToday: newIsToday,
      updatedAt: new Date(),
    };

    // Optimistic update
    storeActions.updateTask(optimisticTask);

    // Server update
    const res = await changeTodoTask(taskId, { isToday: newIsToday });
    if (res.success && res.data) {
      storeActions.updateTask(res.data);
    } else {
      // Rollback on failure
      storeActions.updateTask(originalTask);
      console.error('Failed to toggle task today status:', res.message);
    }

    pendingOperations.current.delete(taskId);
  };

  const deleteTaskOptimistic = async (taskId: string) => {
    // Prevent concurrent operations on the same task
    if (pendingOperations.current.has(taskId)) return;
    pendingOperations.current.add(taskId);

    // Use getState() to get fresh data, avoiding stale closure
    const task = getFreshTask(taskId);
    if (!task) {
      pendingOperations.current.delete(taskId);
      return;
    }

    const originalTask = { ...task };

    // Optimistic delete
    storeActions.deleteTask(taskId);

    // Server delete
    const res = await deleteTodoTask(taskId);
    if (!res.success) {
      // Restore on failure
      storeActions.addTask(originalTask);
      console.error('Failed to delete task:', res.message);
    }

    pendingOperations.current.delete(taskId);
  };

  // Selectors
  const getTasksBySetId = (setId: string): TodoTask[] => {
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
  };

  const getTodoSetById = (setId: string): TodoSetDisplay | DefaultSet => {
    const defaultSet = defaultTodoSet.find((s) => s.id === setId);
    if (defaultSet) return defaultSet;

    const customSet = state.sets.find((s) => s.id === setId);
    if (customSet) {
      return {
        id: customSet.id,
        label: customSet.name,
        icon: null,
        bgImg: customSet.bgImg || "",
      };
    }
    return defaultTodoSet[0];
  };

  const getCountBySetId = (setId: string): number => {
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
  };

  const actions: TodoActions = {
    ...storeActions,
    toggleTaskImportant,
    toggleTaskFinish,
    toggleTaskToday,
    deleteTaskOptimistic,
  };

  const selectors: TodoSelectors = {
    getTasksBySetId,
    getTodoSetById,
    getCountBySetId,
  };

  return (
    <TodoContext.Provider value={{ state, actions, selectors }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}

// Re-export convenience hooks for components that only need specific data
export { useGetUser, useGetTasks, useGetSets, useIsLoading, useGetError };