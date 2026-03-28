"use client";

import { useState } from "react";
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
import { useRouter, usePathname } from "next/navigation";
import { useGetSets, useGetSmartListSettings } from "@/store/todo-app";
import { useSession } from "@/lib/auth-client";
import { defaultTodoSet } from "../lib/default-sets";
import { cn } from "@/lib/utils";
import { TodoSet, TodoCustomSet } from "./sets";
import { useTodo } from "@/contexts/todo-context";

function UserInfo() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2.5 mb-2 px-2 cursor-default" onContextMenu={(e) => e.preventDefault()}>
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
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            <RefreshCw />
            重试同步
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CircleQuestionMark />
            了解详细信息
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <UserRoundCog />
          管理账户
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={user ? "/todo/setting" : "/"}>
            <DropdownMenuItem>
              <Settings />
              设置
            </DropdownMenuItem>
          </Link>
          <Link href="/">
            <DropdownMenuItem>
              <House />
              返回主页
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function SidePannel() {
  const router = useRouter();
  const pathname = usePathname();
  const { actions } = useTodo();
  const { data: session } = useSession();
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const sets = useGetSets();
  const smartListSettings = useGetSmartListSettings();

  const createNewTodoSet = async () => {
    if (!session?.user?.id) return;

    const newSet = await actions.createTodoSetOptimistic(session.user.id, "无标题列表");
    if (newSet) {
      setEditingSetId(newSet.id);
      router.push(`/todo/tasks/${newSet.id}`);
    }
  };

  const handleRenameSet = (setId: string) => {
    setEditingSetId(setId);
  };

  const handleDeleteSet = (setId: string) => {
    // If currently viewing the deleted set, navigate to inbox
    if (pathname === `/todo/tasks/${setId}`) {
      router.push("/todo/tasks/inbox");
    }
  };

  // 根据设置过滤默认列表
  const filteredDefaultSets = defaultTodoSet.filter((item) => {
    switch (item.id) {
      case "important":
        return smartListSettings.smartListImportant;
      case "planned":
        return smartListSettings.smartListPlanned;
      case "assigned_to_me":
        return smartListSettings.smartListAssigned;
      // myday, flagged, inbox 始终显示
      default:
        return true;
    }
  });

  return (
    <Resizable
      defaultSize={{ width: 250 }}
      enable={{ right: true }}
      minWidth={220}
      maxWidth={400}
    >
      <aside className="flex flex-col h-full w-full relative bg-zinc-100 dark:bg-zinc-800">
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
            {filteredDefaultSets.map((item) => (
              <TodoSet key={item.id} item={item} />
            ))}
            <Separator />
            {/* 自定义菜单 */}
            {sets.map((item) => (
              <TodoCustomSet
                key={item.id}
                item={item}
                isEditing={editingSetId === item.id}
                onEditComplete={() => setEditingSetId(null)}
                onRename={() => handleRenameSet(item.id)}
                onDelete={handleDeleteSet}
              />
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
