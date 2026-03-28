
"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AlertDialogDeleteProps {
  type: "列表" | "任务";
  content: string;
  onDelete: () => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AlertDialogDelete({ type, content, onDelete, children, open, onOpenChange }: AlertDialogDeleteProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && (
        <AlertDialogTrigger asChild>
          {children}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="w-70 rounded-sm p-4 gap-12">
        <AlertDialogHeader>
          <AlertDialogTitle>删除{type}</AlertDialogTitle>
          <AlertDialogDescription className="text-black text-xs">
            将永久删除 &ldquo;{content}&rdquo;。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-center! gap-3">
          <AlertDialogAction className="w-28 h-7 rounded-xs" size="xs" variant="destructive" onClick={onDelete}>删除</AlertDialogAction>
          <AlertDialogCancel className="w-28 h-7 rounded-xs" size="xs">取消</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}