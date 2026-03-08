"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type UserProfile } from "@/lib/actions/user/user-actions";

interface ProfileViewProps {
  user: UserProfile;
  onEdit: () => void;
}

export function ProfileView({ user, onEdit }: ProfileViewProps) {
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-[100px_1fr] gap-y-4 text-sm">
      <span className="text-muted-foreground">用户ID</span>
      <span className="font-mono text-muted-foreground">
        {user.id.slice(0, 8)}...
      </span>

      <span className="text-muted-foreground">用户名</span>
      <span>{user.name || "未设置"}</span>

      <span className="text-muted-foreground">邮箱</span>
      <span>{user.email}</span>

      <span className="text-muted-foreground">邮箱验证</span>
      <span>{user.emailVerified ? "已验证" : "未验证"}</span>

      <span className="text-muted-foreground">创建时间</span>
      <span>{formatDate(user.createdAt)}</span>

      <div className="col-span-2 pt-4">
        <Button variant="outline" size="sm" onClick={onEdit}>
          编辑资料
        </Button>
      </div>
    </div>
  );
}

export default ProfileView;