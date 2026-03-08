"use server"

import prisma from "@/lib/prisma";
import { ActionResponse } from '../types'
import { type TodoTask, Prisma } from "@/generated/prisma/client"

export async function createTodoTask(userId: string | undefined, formData: FormData): Promise<ActionResponse<TodoTask>> {
  if (!userId) {
    return { success: false, message: "userId is undefined.", data: null };
  }

  try {
    const rawFormData = Object.fromEntries(formData)

    const todoItem = await prisma.todoTask.create({
      data: {
        id: crypto.randomUUID(),
        userId: userId,
        content: (rawFormData.content as string).trim(),
      },
    });

    return {
      success: true,
      message: 'Todo item created successfully',
      data: todoItem,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create todo item: ${error}`,
      data: null,
    };
  }
}

export async function getAllTodoTasks(userId: string): Promise<ActionResponse<TodoTask[]>> {
  try {
    const todoItems = await prisma.todoTask.findMany({
      where: {
        userId,
      },
      orderBy: [
        { isImportant: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    return {
      success: true,
      message: 'Todo items fetched successfully',
      data: todoItems,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to fetch todo items: ${error}`,
      data: null,
    };
  }
}

export async function getTodoTasksBySetId(userId: string | undefined, todoSetId?: string): Promise<ActionResponse<TodoTask[]>> {
  if (!userId) {
    return { success: false, message: "userId is undefined.", data: null };
  }

  try {
    const where: Prisma.TodoTaskWhereInput = {
      userId,
    };

    if (todoSetId === "today") {
      where.isToday = true;
    } else if (todoSetId === "important") {
      where.isImportant = true;
    } else if (todoSetId === "inbox") {
      // inbox集合用于获取所有的todoItem
    } else if (todoSetId === "planned") {
      where.dueDate = { not: null };
    } else {
      where.setId = todoSetId;
    }

    const todoItems = await prisma.todoTask.findMany({
      where,
      orderBy: [
        { isImportant: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    return {
      success: true,
      message: 'Todo items fetched successfully',
      data: todoItems,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to fetch todo items: ${error}`,
      data: null,
    };
  }
}

export async function changeTodoTask(todoId: string, input: Partial<Omit<TodoTask, "id">>): Promise<ActionResponse<TodoTask>> {
  try {
    const todoItem = await prisma.todoTask.update({
      where: {
        id: todoId,
      },
      data: {
        ...input,
      },
    });

    return {
      success: true,
      message: 'Todo item updated successfully',
      data: todoItem,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to update todo item: ${error}`,
      data: null,
    };
  }
}

export async function deleteTodoTask(todoId: string): Promise<ActionResponse<TodoTask>> {
  try {
    const deletedTodoItem = await prisma.todoTask.delete({
      where: {
        id: todoId,
      },
    });

    return {
      success: true,
      message: 'Todo item deleted successfully',
      data: deletedTodoItem,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to delete todo item: ${error}`,
      data: null,
    };
  }
}