import {
  Sun,
  Star,
  SquareKanban,
  User,
  Flag,
  Home,
  Computer,
  Briefcase,
  Bookmark,
} from "lucide-react";
import React from "react";

enum BgColor {
  darkblue = "darkblue",
  darkpink = "darkpink",
  darkred = "darkred",
  darkorange = "darkorange",
  darkgreen = "darkgreen",
  darkteal = "darkteal",
  darkgray = "darkgray",
  blue = "blue",
  pink = "pink",
  red = "red",
  orange = "orange",
  green = "green",
  teal = "teal",
  gray = "gray",
}

export interface DefaultSet {
  id: string;
  label: string;
  icon: React.JSX.Element | null;
  bgImg: string | BgColor;
  count?: number;
  card?: Card;
}

interface Card {
  img: string;
  title: string | undefined;
  content: string;
}

export const defaultTodoSet: DefaultSet[] = [
  {
    id: "myday",
    label: "我的一天",
    icon: <Sun />,
    bgImg: "/todo-wallpapers/bg-1.png",
    card: {
      img: "/todo-set-imgs/today.png",
      title: "专注于你的一天",
      content: "使用“我的一天”完成任务，这是一个每天都会刷新的列表",
    },
  },
  {
    id: "important",
    label: "重要",
    icon: <Star />,
    bgImg: "/todo-wallpapers/bg-2.png",
    card: {
      img: "/todo-set-imgs/important.png",
      title: undefined,
      content: "长输出为一些任务加星标，以便在此处查看它们",
    },
  },
  {
    id: "planned",
    label: "计划内",
    icon: <SquareKanban />,
    bgImg: "/todo-wallpapers/bg-3.png",
    card: {
      img: "/todo-set-imgs/planned.png",
      title: undefined,
      content: "此处显示带有截止日期或提醒的任务",
    },
  },
  {
    id: "assigned_to_me",
    label: "已分配给我",
    icon: <User />,
    bgImg: "/todo-wallpapers/bg-4.png",
    card: {
      img: "/todo-set-imgs/assigned.png",
      title: undefined,
      content: "分配给你的任务显示在此处",
    },
  },
  {
    id: "flagged",
    label: "标记的电子邮件",
    icon: <Flag />,
    bgImg: "/todo-wallpapers/bg-5.png",
    card: {
      img: "/todo-set-imgs/flagged.png",
      title: undefined,
      content: "标记的邮件在此处显示为任务",
    },
  },
  {
    id: "inbox",
    label: "任务",
    icon: <Home />,
    bgImg: "/todo-wallpapers/bg-6.png",
    card: {
      img: "/todo-set-imgs/flagged.png", // TODO: 待修改为tasks.png
      title: undefined,
      content: "查看所有任务，待修改。",
    },
  },
];
