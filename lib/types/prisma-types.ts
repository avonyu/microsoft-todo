// Re-export Prisma types with PascalCase names for backward compatibility
export type { account as Account, session as Session, user as User, verification as Verification } from "@/generated/prisma/client";
export type { todoSet as TodoSet, todoTask as TodoTask, todoTaskStep as TodoTaskStep } from "@/generated/prisma/client";

// Re-export input types from model files
export type { todoTaskWhereInput as TodoTaskWhereInput } from "@/generated/prisma/models/todoTask";

// Re-export Prisma namespace for advanced types
export { Prisma } from "@/generated/prisma/client";