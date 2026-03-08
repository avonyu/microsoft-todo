"use client";

import { cloneElement } from "react";

interface SetHeaderProps {
  setId: string;
  label: string;
  icon?: React.ReactNode;
}

/**
 * Header component for "My Day" set with date display
 */
function MyDayHeader({ label }: { label: string }) {
  const getData = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const week = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    return `${month}月${day}日，${week[date.getDay()]}`;
  };

  return (
    <div className="py-6">
      <h1 className="text-white text-3xl font-semibold ml-2">{label}</h1>
      <p className="text-white text-sm font-medium ml-2">{getData()}</p>
    </div>
  );
}

/**
 * Header component for standard sets with icon
 */
function StandardSetHeader({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center py-6">
      {icon &&
        cloneElement(icon as React.ReactElement<{ size?: number; className?: string }>, {
          size: 24,
          className: "text-white",
        })}
      <h1 className="text-white text-3xl font-semibold ml-2">{label}</h1>
    </div>
  );
}

/**
 * SetHeader renders the appropriate header variant based on setId.
 * Uses explicit variants instead of conditional rendering in the parent component.
 */
export function SetHeader({ setId, label, icon }: SetHeaderProps) {
  if (setId === "myday") {
    return <MyDayHeader label={label} />;
  }
  return <StandardSetHeader label={label} icon={icon} />;
}

export default SetHeader;