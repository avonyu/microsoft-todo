"use client";

import { cloneElement, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Resizable } from "re-resizable";
import {
  Sun,
  Search,
  Star,
  SquareKanban,
  User,
  Flag,
  Plus,
  Home,
  Computer,
  Bookmark,
  FolderPlus,
  Briefcase,
  UserRoundCog,
  Settings,
  CircleQuestionMark,
  RefreshCw,
  House,
  ChevronsUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useGetUser, useGetSets } from "@/store/todo-app";
import { defaultTodoSet } from "../config";
import { cn } from "@/lib/utils";
import { TodoSet, TodoCustomSet } from "./sets";

function UserInfo() {
  const user = useGetUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2.5 mb-2 px-2 cursor-default">
          <Avatar className="size-11">
            <AvatarImage src={user?.image || undefined} alt="User Avatar" />
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {user?.name}
            </h3>
            <div className="flex items-center gap-1">
              <p className="text-xs text-gray-600 dark:text-gray-200">
                {user?.email}
              </p>
              <ChevronsUpDown size={14} />
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <RefreshCw />
            重试同步
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CircleQuestionMark />
            了解详细信息
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserRoundCog />
          管理账户
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/">
            <DropdownMenuItem>
              <House />
              返回主页
            </DropdownMenuItem>
          </Link>
          <Link href={user ? "/todo/setting" : "/"}>
            <DropdownMenuItem>
              <Settings />
              设置
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function SidePannel() {
  const createNewTodoSet = () => {
    // 乐观更新
  };

  return (
    <Resizable
      defaultSize={{ width: 250 }}
      enable={{ right: true }}
      minWidth={220}
      maxWidth={400}
    >
      <aside className="flex flex-col h-full w-full relative bg-white dark:bg-zinc-800">
        {/* 侧边栏内容 */}
        <div className="h-full flex flex-col overflow-hidden px-1 pt-3 w-full relative">
          {/* 个人信息区 */}
          <UserInfo />
          {/*  带图标的搜索框 */}
          <div className="flex flex-col px-2 mb-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="搜索"
                className="w-full pl-9 pr-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:bg-gray-300"
              />
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 overflow-y-auto flex flex-col space-y-1">
            {defaultTodoSet.map((item) => (
              <TodoSet key={item.id} item={item} />
            ))}
            <Separator />
            {/* 自定义菜单 */}
            {useGetSets().map((item) => (
              <TodoCustomSet key={item.id} item={item} />
            ))}
          </nav>
        </div>

        {/* 新建列表按钮 */}
        <div className="flex w-full bg-white dark:bg-zinc-800 border-t">
          <button
            onClick={() => {
              createNewTodoSet();
            }}
            className={cn(
              "flex-1 flex items-center gap-2 p-2 rounded-sm text-sm text-gray-800 dark:text-gray-200 ",
              "hover:bg-gray-100 dark:hover:bg-zinc-700",
            )}
          >
            <Plus size={16} />
            新建列表
          </button>
          <button className="px-2 h-full hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-sm">
            <FolderPlus size={16} />
          </button>
        </div>
      </aside>
    </Resizable>
  );
}
