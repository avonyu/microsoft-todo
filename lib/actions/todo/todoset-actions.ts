"use server"

import prisma from "@/lib/prisma";
import { type TodoSet } from "@/lib/types/prisma-types";
import { ActionResponse } from "../types";

export async function createTodoSet(userId: string, name: string): Promise<ActionResponse<TodoSet>> {
  try {
    const todoSet = await prisma.todoSet.create({
      data: {
        id: crypto.randomUUID(),
        name: name,
        userId: userId,
      },
    });

    return {
      success: true,
      message: 'Todo set created successfully',
      data: todoSet,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create todo set: ${error}`,
      data: null,
    };
  }
}

export async function getAllTodoSets(userId: string): Promise<ActionResponse<TodoSet[]>> {
  try {
    const todoSets = await prisma.todoSet.findMany({
      where: {
        userId: userId,
      },
    });

    return {
      success: true,
      message: 'Todo sets fetched successfully',
      data: todoSets,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to fetch todo sets: ${error}`,
      data: null,
    };
  }
}

export async function updateTodoSet(setId: string, data: Partial<Omit<TodoSet, 'id' | 'userId' | 'createdAt'>>): Promise<ActionResponse<TodoSet>> {
  try {
    const todoSet = await prisma.todoSet.update({
      where: {
        id: setId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Todo set updated successfully',
      data: todoSet,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to update todo set: ${error}`,
      data: null,
    };
  }
}

export async function deleteTodoSet(setId: string): Promise<ActionResponse<TodoSet>> {
  try {
    const todoSet = await prisma.todoSet.delete({
      where: {
        id: setId,
      },
    });

    return {
      success: true,
      message: 'Todo set deleted successfully',
      data: todoSet,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to delete todo set: ${error}`,
      data: null,
    };
  }
}