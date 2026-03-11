"use server"

import prisma from "@/lib/prisma"
import { ActionResponse } from "../types"
import type { Prisma } from "@/generated/prisma/client"

export interface UserPreferences {
  setBgImages?: Record<string, string>
  [key: string]: string | Record<string, string> | Prisma.InputJsonValue | undefined
}

export async function getUserPreferences(
  userId: string
): Promise<ActionResponse<UserPreferences>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { setPreferences: true },
    })

    if (!user?.setPreferences) {
      return { success: true, message: "No preferences found", data: {} }
    }

    // PostgreSQL Json type returns the parsed object directly
    return { success: true, message: "Preferences retrieved", data: user.setPreferences as UserPreferences }
  } catch (error) {
    console.error("Failed to get user preferences:", error)
    return {
      success: false,
      message: "Failed to get preferences",
      data: null,
    }
  }
}

export async function updateUserPreferences(
  userId: string,
  preferences: UserPreferences
): Promise<ActionResponse<void>> {
  try {
    // PostgreSQL Json type handles serialization automatically
    await prisma.user.update({
      where: { id: userId },
      data: { setPreferences: preferences },
    })
    return { success: true, message: "Preferences updated", data: null }
  } catch (error) {
    console.error("Failed to update user preferences:", error)
    return {
      success: false,
      message: "Failed to update preferences",
      data: null,
    }
  }
}

export async function updateSetBgImage(
  userId: string,
  setId: string,
  bgImg: string
): Promise<ActionResponse<void>> {
  try {
    // Get current preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { setPreferences: true },
    })

    // PostgreSQL Json type returns parsed object directly
    const currentPrefs = (user?.setPreferences as UserPreferences) || {}

    // Initialize setBgImages if not exists and update
    const preferences: UserPreferences = {
      ...currentPrefs,
      setBgImages: {
        ...(currentPrefs.setBgImages || {}),
        [setId]: bgImg,
      },
    }

    // Save to database - Json type handles serialization automatically
    await prisma.user.update({
      where: { id: userId },
      data: { setPreferences: preferences },
    })

    return { success: true, message: "Background image updated", data: null }
  } catch (error) {
    console.error("Failed to update set background image:", error)
    return {
      success: false,
      message: "Failed to update background image",
      data: null,
    }
  }
}