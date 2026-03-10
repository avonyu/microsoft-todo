"use server"

import prisma from "@/lib/prisma"
import { ActionResponse } from "../types"

export interface UserPreferences {
  setBgImages?: Record<string, string>
  [key: string]: unknown
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

    const preferences = JSON.parse(user.setPreferences) as UserPreferences
    return { success: true, message: "Preferences retrieved", data: preferences }
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
    await prisma.user.update({
      where: { id: userId },
      data: { setPreferences: JSON.stringify(preferences) },
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to update user preferences:", error)
    return {
      success: false,
      message: "Failed to update preferences",
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

    let preferences: UserPreferences = {}
    if (user?.setPreferences) {
      preferences = JSON.parse(user.setPreferences)
    }

    // Initialize setBgImages if not exists
    if (!preferences.setBgImages) {
      preferences.setBgImages = {}
    }

    // Update the background image for the set
    preferences.setBgImages[setId] = bgImg

    // Save to database
    await prisma.user.update({
      where: { id: userId },
      data: { setPreferences: JSON.stringify(preferences) },
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to update set background image:", error)
    return {
      success: false,
      message: "Failed to update background image",
    }
  }
}