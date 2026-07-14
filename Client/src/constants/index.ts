import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Lightbulb,
  Settings,
} from "lucide-react";

export type Transaction = {
  _id?: string,
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
  { name: "Overview", icon: LayoutDashboard, href:"/overview"},
  { name: "Reports", icon: FileText, href:"#" },
  { name: "Analytics", icon: BarChart3, href:"/analytics" },
  { name: "Insights", icon: Lightbulb, href:"#"  },
  { name: "Settings", icon: Settings , href:"#" },
];

export type Registration = {
  name: string,
  email: string,
  password: string,
  confirm_password:string
}