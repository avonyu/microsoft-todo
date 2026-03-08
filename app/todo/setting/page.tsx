"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  Star,
  Calendar,
  User,
  Infinity,
  Check,
  Flag,
  Bell,
  Share2,
  Info,
  Lightbulb,
  MessageSquare,
  Copy,
  RotateCw,
  Wrench,
  Mail,
  ChevronDown,
  Moon,
  Sun,
  Monitor,
  Twitter,
  Facebook,
  Heart,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useTheme } from "next-themes";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function ThemeSetting() {
  const { theme, setTheme } = useTheme();
  return (
    <Section title="主题">
      <RadioGroup value={theme} onValueChange={setTheme} className="space-y-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="light" id="theme-light" />
          <Label htmlFor="theme-light" className="cursor-pointer">
            浅色主题
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dark" id="theme-dark" />
          <Label htmlFor="theme-dark" className="cursor-pointer">
            深色主题
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="system" id="theme-system" />
          <Label htmlFor="theme-system" className="cursor-pointer">
            使用系统 Windows 主题
          </Label>
        </div>
      </RadioGroup>
    </Section>
  );
}

export default function TodoSettingPage() {
  // State for settings
  const [settings, setSettings] = useState({
    diagnosticDataRequired: false,
    diagnosticDataOptional: false,
    addNewToTop: true,
    moveStarredToTop: true,
    playCompletionSound: true,
    contextMenu: true,
    autoStart: false,
    smartListImportant: true,
    smartListPlanned: true,
    smartListAssigned: false,
    smartListAll: false,
    smartListCompleted: true,
    autoHideEmptySmartLists: false,
    showTodayTasks: true,
    connectedPlanner: true,
    connectedEmail: true,
    notificationsReminders: true,
    notificationsShared: true,
  });

  const [weekStart, setWeekStart] = useState("系统默认");
  const [badgeCount, setBadgeCount] = useState("今天到期的逾期");

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { data: session } = useSession();
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
      {/* User Profile */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="size-20">
            <AvatarImage
              src={session?.user.image || undefined}
              alt="User Avatar"
            />
          </Avatar>
          <div>
            <h2 className="text-lg font-medium">{session?.user.name}</h2>
            <p className="text-sm text-muted-foreground">
              {session?.user.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <Button variant="outline" size="sm">
            管理帐户
          </Button>
          <Button variant="destructive" size="sm">
            注销
          </Button>
        </div>
      </div>

      <Separator />

      {/* General Section */}
      <Section title="常规">
        <SettingItemVertical
          label="在顶部添加新任务"
          checked={settings.addNewToTop}
          onCheckedChange={() => toggleSetting("addNewToTop")}
        />
        <SettingItemVertical
          label="将带有星标的任务移至顶部"
          checked={settings.moveStarredToTop}
          onCheckedChange={() => toggleSetting("moveStarredToTop")}
        />
        <SettingItemVertical
          label="播放完成提示音"
          checked={settings.playCompletionSound}
          onCheckedChange={() => toggleSetting("playCompletionSound")}
        />
        <SettingItemVertical
          label="右键单击菜单"
          checked={settings.contextMenu}
          onCheckedChange={() => toggleSetting("contextMenu")}
        />
        <SettingItemVertical
          label="保持 Windows 启动时自动启动待办事项"
          checked={settings.autoStart}
          onCheckedChange={() => toggleSetting("autoStart")}
        />

        <div className="py-2 flex flex-col space-y-1.5">
          <Label>一周的开始</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between font-normal"
              >
                {weekStart}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px]" align="start">
              <DropdownMenuItem onClick={() => setWeekStart("系统默认")}>
                系统默认
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setWeekStart("星期日")}>
                星期日
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setWeekStart("星期一")}>
                星期一
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="py-2 flex flex-col space-y-1.5">
          <Label>应用徽章</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between font-normal"
              >
                {badgeCount}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px]" align="start">
              <DropdownMenuItem onClick={() => setBadgeCount("今天到期的逾期")}>
                今天到期的逾期
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBadgeCount("未完成的任务")}>
                未完成的任务
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBadgeCount("关闭")}>
                关闭
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="py-2 space-y-2">
          <p className="text-sm text-muted-foreground">
            可帮助您从其他列表应用定位任务，以便于快速访问
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            设置为默认
          </Button>
        </div>

        <Button variant="link" className="p-0 h-auto text-blue-500">
          键盘快捷方式
        </Button>
      </Section>

      <Separator />

      {/* Theme Section */}
      <ThemeSetting />
      <Separator />

      {/* Smart Lists Section */}
      <Section title="智能列表">
        <SettingItemHorizontal
          icon={<Star className="size-5 text-blue-500" />}
          label="重要"
          checked={settings.smartListImportant}
          onCheckedChange={() => toggleSetting("smartListImportant")}
        />
        <SettingItemHorizontal
          icon={<Calendar className="size-5 text-blue-500" />}
          label="计划内"
          checked={settings.smartListPlanned}
          onCheckedChange={() => toggleSetting("smartListPlanned")}
        />
        <SettingItemHorizontal
          icon={<Check className="size-5 text-blue-500" />}
          label="已完成"
          checked={settings.smartListCompleted}
          onCheckedChange={() => toggleSetting("smartListCompleted")}
        />
        <SettingItemHorizontal
          icon={<Infinity className="size-5 text-blue-500" />}
          label="全部"
          checked={settings.smartListAll}
          onCheckedChange={() => toggleSetting("smartListAll")}
        />
        <SettingItemHorizontal
          icon={<User className="size-5 text-blue-500" />}
          label="已分配给我"
          checked={settings.smartListAssigned}
          onCheckedChange={() => toggleSetting("smartListAssigned")}
        />

        <div className="pt-2">
          <SettingItemHorizontal
            label="自动隐藏空的智能列表"
            checked={settings.autoHideEmptySmartLists}
            onCheckedChange={() => toggleSetting("autoHideEmptySmartLists")}
          />
        </div>
        <div className="pt-2">
          <SettingItemHorizontal
            label="在我的“一天”视图中显示今天截止的任务"
            checked={settings.showTodayTasks}
            onCheckedChange={() => toggleSetting("showTodayTasks")}
          />
        </div>
      </Section>

      <Separator />

      {/* Connected Apps */}
      <Section title="连接的应用">
        <SettingItemHorizontal
          icon={<Wrench className="h-4 w-4 text-green-500" />}
          label="Planner"
          subLabel="在 Planner 中分配给你的任务"
          checked={settings.connectedPlanner}
          onCheckedChange={() => toggleSetting("connectedPlanner")}
        />
        <SettingItemHorizontal
          icon={<Flag className="h-4 w-4 text-blue-400" />}
          label="标记的电子邮件"
          subLabel="你存 Outlook 中已标记的电子邮件中的任务"
          checked={settings.connectedEmail}
          onCheckedChange={() => toggleSetting("connectedEmail")}
        />
      </Section>

      <Separator />

      {/* Notifications */}
      <Section title="通知">
        <SettingItemVertical
          label="提醒"
          checked={settings.notificationsReminders}
          onCheckedChange={() => toggleSetting("notificationsReminders")}
        />
        <SettingItemVertical
          label="已共享列表活动"
          checked={settings.notificationsShared}
          onCheckedChange={() => toggleSetting("notificationsShared")}
        />
      </Section>

      <Separator />

      {/* Help & Feedback */}
      <Section title="帮助和反馈">
        <div className="flex items-start space-x-2 text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded-md">
          <Info className="h-5 w-5 shrink-0" />
          <div>
            <p>
              当前无法同步。请与支持部门联系或稍后再试。上次成功同步时间:
              2025年1月20日 19:53:21。
            </p>
          </div>
        </div>

        <Button variant="secondary" size="sm" disabled>
          同步中...
        </Button>

        <div className="flex flex-col space-y-2 pt-2">
          <Button
            variant="link"
            className="justify-start p-0 h-auto text-blue-500"
          >
            了解详细信息
          </Button>
          <Button
            variant="link"
            className="justify-start p-0 h-auto text-blue-500"
          >
            建议功能
          </Button>
          <Button
            variant="link"
            className="justify-start p-0 h-auto text-blue-500"
          >
            对我们评分
          </Button>
          <Button
            variant="link"
            className="justify-start p-0 h-auto text-blue-500"
          >
            复制会话和用户 ID
          </Button>
        </div>
      </Section>

      <Separator />

      {/* Connect */}
      <Section title="连接">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-blue-500 cursor-pointer hover:underline">
            <Twitter className="h-6 w-6 fill-current" />
            <span>在 Twitter 上关注我们</span>
          </div>
          <div className="flex items-center space-x-3 text-blue-600 cursor-pointer hover:underline">
            <Facebook className="h-6 w-6 fill-current" />
            <span>在 Facebook 上赞我们</span>
          </div>
          <div className="flex items-center space-x-3 text-red-500 cursor-pointer hover:underline">
            <Heart className="h-6 w-6 fill-current" />
            <span>广而告之</span>
          </div>
        </div>
      </Section>

      <Separator />

      {/* About */}
      <Section title="关于">
        <div className="flex flex-col space-y-2">
          <Button
            variant="link"
            className="justify-start p-0 h-auto text-blue-500"
          >
            隐私
          </Button>
          <Button
            variant="link"
            className="justify-start p-0 h-auto text-blue-500"
          >
            导出你的信息
          </Button>
          <Button
            variant="link"
            className="justify-start p-0 h-auto text-blue-500"
          >
            Microsoft 软件许可条款
          </Button>
          <Button
            variant="link"
            className="justify-start p-0 h-auto text-blue-500"
          >
            第三方通知
          </Button>
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">发送所需诊断数据</Label>
            <Switch
              checked={settings.diagnosticDataRequired}
              onCheckedChange={() => toggleSetting("diagnosticDataRequired")}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            我们将收集为确保“待办事项”在其安装设备上处于安全及最新状态并如期运行而需要的诊断数据。例如，你正在使用的操作系统以及是否已成功安装更新。
          </p>
          <Button variant="link" className="p-0 h-auto text-blue-500">
            了解有关诊断数据的详细信息
          </Button>
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">发送可选诊断数据</Label>
            <Switch
              checked={settings.diagnosticDataOptional}
              onCheckedChange={() => toggleSetting("diagnosticDataOptional")}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            我们希望向我们发送其他诊断和使用情况数据。这是我们继续改进的功能。这些数据均不包含你的姓名、文件内容或与待办事项无关的应用的信息。
          </p>
          <Button variant="link" className="p-0 h-auto text-blue-500">
            了解有关可选诊断数据的详细信息
          </Button>
        </div>
      </Section>

      <Separator />

      {/* Footer */}
      <footer className="pb-10 space-y-1 text-sm text-muted-foreground">
        <h4 className="font-medium text-foreground">Microsoft To Do By Avon</h4>
        <p>© 2026 Avon. 保留所有权利</p>
        <p>2.153.5851.0</p>
      </footer>
    </div>
  );
}

function SettingItemHorizontal({
  icon,
  label,
  subLabel,
  checked,
  onCheckedChange,
}: {
  icon?: React.ReactNode;
  label: string;
  subLabel?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center space-x-3">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="flex flex-col">
          <Label className="text-base font-normal">{label}</Label>
          {subLabel && (
            <span className="text-xs text-muted-foreground">{subLabel}</span>
          )}
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        // className="data-[state=checked]:bg-teal-700"
      />
    </div>
  );
}

function SettingItemVertical({
  icon,
  label,
  subLabel,
  checked,
  onCheckedChange,
}: {
  icon?: React.ReactNode;
  label: string;
  subLabel?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-2 justify-between py-1">
      <div className="flex items-center space-x-3">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="flex flex-col">
          <Label className="text-base font-normal">{label}</Label>
          {subLabel && (
            <span className="text-xs text-muted-foreground">{subLabel}</span>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          // className="data-[state=checked]:bg-teal-700"
        />
        {checked ? "开" : "关"}
      </div>
    </div>
  );
}
