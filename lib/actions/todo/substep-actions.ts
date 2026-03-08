"use server"

import prisma from "@/lib/prisma";
import { ActionResponse } from "../types";

export interface Substep {
  id: string;
  content: string;
  isFinish: boolean;
  taskId: string;
}

export interface SubstepInput {
  content: string;
  isFinish: boolean;
  taskId: string;
}

export async function createSubstep(userId: string, input: SubstepInput): Promise<ActionResponse<Substep>> {
  try {
    const substep = await prisma.todoTaskStep.create({
      data: {
        id: crypto.randomUUID(),
        content: input.content,
        isFinish: input.isFinish || false,
        taskId: input.taskId,
        userId: userId,
      },
    });

    return {
      success: true,
      message: 'Substep created successfully',
      data: substep,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create substep: ${error}`,
      data: null,
    };
  }
}

export async function getAllSubsteps(taskId: string): Promise<ActionResponse<Substep[]>> {
  try {
    const substeps = await prisma.todoTaskStep.findMany({
      where: {
        taskId,
      },
    });

    return {
      success: true,
      message: 'Substeps fetched successfully',
      data: substeps,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to fetch substeps: ${error}`,
      data: null,
    };
  }
}

export async function updateSubstep(substepId: string, input: SubstepInput): Promise<ActionResponse<Substep>> {
  try {
    const substep = await prisma.todoTaskStep.update({
      where: {
        id: substepId,
      },
      data: {
        content: input.content,
        isFinish: input.isFinish,
        taskId: input.taskId,
      },
    });

    return {
      success: true,
      message: 'Substep updated successfully',
      data: substep,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to update substep: ${error}`,
      data: null,
    };
  }
}

export async function deleteSubstep(substepId: string): Promise<ActionResponse<Substep>> {
  try {
    const deletedSubstep = await prisma.todoTaskStep.delete({
      where: {
        id: substepId,
      },
    });

    return {
      success: true,
      message: 'Substep deleted successfully',
      data: deletedSubstep,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to delete substep: ${error}`,
      data: null,
    };
  }
}