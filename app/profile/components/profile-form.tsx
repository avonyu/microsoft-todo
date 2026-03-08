"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { updateProfile, type UserProfile } from "@/lib/actions/user/user-actions";

interface ProfileFormProps {
  user: UserProfile;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [updatedUser, setUpdatedUser] = useState<UserProfile>(user);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const handleEdit = () => {
    setEditName(updatedUser.name || "");
    setIsEditing(true);
    setMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(updatedUser.name || "");
    setMessage(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await updateProfile({ name: editName });

      if (result.success && result.data) {
        setUpdatedUser(result.data);
        setMessage({ type: "success", text: result.message });
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch {
      setMessage({ type: "error", text: "保存失败，请重试" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header: Avatar + Name */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="size-24 md:size-32">
                <AvatarImage
                  src={updatedUser.image || undefined}
                  alt={updatedUser.name || "User Avatar"}
                />
                <AvatarFallback className="bg-linear-to-br from-primary to-primary/60 text-3xl md:text-4xl text-primary-foreground">
                  {getInitials(updatedUser.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {updatedUser.name || "用户"}
          </h1>
        </div>

        {/* Info Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">个人信息</h2>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  编辑资料
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {message && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  message.type === "error"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-green-500/10 text-green-600"
                }`}
              >
                {message.text}
              </div>
            )}

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                  <span className="text-muted-foreground text-sm">用户ID</span>
                  <span className="text-sm font-mono text-muted-foreground">
                    {updatedUser.id.slice(0, 8)}...
                  </span>

                  <span className="text-muted-foreground text-sm">用户名</span>
                  <Input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="请输入用户名"
                  />

                  <span className="text-muted-foreground text-sm">邮箱</span>
                  <span className="text-sm text-muted-foreground">
                    {updatedUser.email}
                    <span className="text-xs ml-2 text-muted-foreground/60">
                      (无法修改)
                    </span>
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    取消
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "保存中..." : "保存"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-[100px_1fr] gap-y-4 text-sm">
                <span className="text-muted-foreground">用户ID</span>
                <span className="font-mono text-muted-foreground">
                  {updatedUser.id.slice(0, 8)}...
                </span>

                <span className="text-muted-foreground">用户名</span>
                <span>{updatedUser.name || "未设置"}</span>

                <span className="text-muted-foreground">邮箱</span>
                <span>{updatedUser.email}</span>

                <span className="text-muted-foreground">邮箱验证</span>
                <span>{updatedUser.emailVerified ? "已验证" : "未验证"}</span>

                <span className="text-muted-foreground">创建时间</span>
                <span>{formatDate(updatedUser.createdAt)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
