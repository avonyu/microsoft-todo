export interface ActionResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// Helper functions for consistent responses
export function success<T>(message: string, data: T): ActionResponse<T> {
  return { success: true, message, data };
}

export function failure<T>(message: string): ActionResponse<T> {
  return { success: false, message, data: null };
}