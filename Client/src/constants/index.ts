import {
  BarChart3,
  BookAlert,
  FileText,
  LayoutDashboard,
  Lightbulb,
  Settings,
} from "lucide-react";

export type Transaction = {
  _id?: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string | Date;
  created_date: string | Date;
};

export interface budgetDto {
  userId: string,
  budgetCategory: string,
  budgetAmount: number
}

export interface BudgetProps {
  budgetId: string;
  amount: number;
  budgetCategory: string;
  percentage: number;
  budgetAmount: number;
}

export const EXPENSE_CATEGORIES = [
  "food",
  "transportation",
  "shopping",
  "bill",
  "housing",
  "healthcare",
  "entertainment",
  "education",
  "personal",
  "others",
] as const;

export const INCOME_CATEGORIES = [
  "salary",
  "freelance",
  "passive income",
  "business",
  "investment",
  "gift",
  "refund",
  "allowance",
  "bonus",
  "others",
] as const;

export const CATEGORY_COLORS = {
  others: "#ec4899",
  food: "#f59e0b",
  transportation: "#8b5cf6",
  shopping: "#34d399",
  bill: "#ef4444",
  housing: "#14b8a6",
  healthcare: "#f43f5e",
  entertainment: "#fbbf24",
  education: "#3b82f6",
  personal: "#22c55e",
  salary: "#16a34a",
  freelance: "#0ea5e9",
  passive: "#8b5cf6",
  business: "#a16207",
  investment: "#0f766e",
  gift: "#ec4899",
  refund: "#a3a3a3",
  allowance: "#6366f1",
  bonus: "#f97316",
} as const;

export const navItems = [
  { name: "Overview", icon: LayoutDashboard, href:"/overview"},
  { name: "Reports", icon: FileText, href:"/reports" },
  { name: "Analytics", icon: BarChart3, href:"/analytics" },
  { name: "Budget", icon: BookAlert , href:"/getBudget" },
  { name: "Insights", icon: Lightbulb, href:"/insights"  },
  { name: "Settings", icon: Settings , href:"#" },
];

export type Registration = {
  name: string,
  email: string,
  password: string,
  confirm_password:string
}

export const PUBLIC_ROUTES = [
  "/",
  "/register",
  "/forgotPassword",
  "/verify-email",
  "/reset-password",
];