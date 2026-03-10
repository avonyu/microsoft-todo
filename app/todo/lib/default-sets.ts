import {
  Sun,
  Star,
  SquareKanban,
  User,
  Flag,
  Home,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";
import configJson from "./config.json";

export interface DefaultSet {
  id: string;
  label: string;
  icon: React.JSX.Element | null;
  bgImg: string;
  count?: number;
  card?: Card;
}

interface Card {
  img: string;
  title: string | undefined;
  content: string;
}

const iconMap: Record<string, LucideIcon> = {
  Sun,
  Star,
  SquareKanban,
  User,
  Flag,
  Home,
};

export const defaultTodoSet: DefaultSet[] = configJson.defaultTodoSet.map(
  (s) => ({
    ...s,
    icon: iconMap[s.icon] ? React.createElement(iconMap[s.icon]) : null,
    card: s.card
      ? { ...s.card, title: s.card.title ?? undefined }
      : undefined,
  })
);
