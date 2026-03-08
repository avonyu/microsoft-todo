"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-3 border-b sticky top-0 bg-background/90 backdrop-blur z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/todo")}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">设置</h1>
      </header>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

export default Layout;
