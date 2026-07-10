import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Lightbulb,
  Settings,
} from "lucide-react";

export type Transaction = {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  created_date: Date;
}

export const CATEGORY_COLORS = {
  others: "pink",
  food: "darkorange",
  transportation: "blueviolet",
  shopping: "lightgreen",
  bill: "indianred",

} as const;

export const navItems = [
  { name: "Overview", icon: LayoutDashboard, href:"/"},
  { name: "Reports", icon: FileText },
  { name: "Analytics", icon: BarChart3, href:"analytics" },
  { name: "Insights", icon: Lightbulb },
  { name: "Settings", icon: Settings },
];