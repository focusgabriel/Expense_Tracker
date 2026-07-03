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
  bill: "blue",

} as const;

export const navItems = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Reports", icon: FileText },
  { name: "Analytics", icon: BarChart3 },
  { name: "Insights", icon: Lightbulb },
  { name: "Settings", icon: Settings },
];