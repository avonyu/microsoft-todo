"use server"

import prisma from "@/lib/prisma";
import { type TodoSet } from "@/generated/prisma/client";
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