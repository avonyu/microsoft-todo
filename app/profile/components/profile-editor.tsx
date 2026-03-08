"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type UserProfile } from "@/lib/actions/user/user-actions";

interface ProfileEditorProps {
  user: UserProfile;
  onSave: (data: { name: string }) => void;
  onCancel: () => void;
  isLoading: boolean;
  editName: string;
  onNameChange: (name: string) => void;
}

export function ProfileEditor({
  user,
  onSave,
  onCancel,
  isLoading,
  editName,
  onNameChange,
}: ProfileEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
        <span className="text-muted-foreground text-sm">用户ID</span>
        <span className="text-sm font-mono text-muted-foreground">
          {user.id.slice(0, 8)}...
        </span>

        <span className="text-muted-foreground text-sm">用户名</span>
        <Input
          type="text"
          value={editName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="请输入用户名"
        />

        <span className="text-muted-foreground text-sm">邮箱</span>
        <span className="text-sm text-muted-foreground">
          {user.email}
          <span className="text-xs ml-2 text-muted-foreground/60">
            (无法修改)
          </span>
        </span>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          取消
        </Button>
        <Button onClick={() => onSave({ name: editName })} disabled={isLoading}>
          {isLoading ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  );
}

export default ProfileEditor;