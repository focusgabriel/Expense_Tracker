import {
  BarChart3,
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

export const EXPENSE_CATEGORIES = [
  "food",
  "transportation",
  "shopping",
  "bills",
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
  others: "pink",
  food: "darkorange",
  transportation: "blueviolet",
  shopping: "lightgreen",
  bills: "indianred",
  housing: "teal",
  healthcare: "crimson",
  entertainment: "goldenrod",
  education: "steelblue",
  personal: "mediumseagreen",
  salary: "forestgreen",
  freelance: "dodgerblue",
  "passive income": "mediumpurple",
  business: "saddlebrown",
  investment: "darkcyan",
  gift: "hotpink",
  refund: "olive",
  allowance: "slateblue",
  bonus: "orangered",
} as const;

export const navItems = [
  { name: "Overview", icon: LayoutDashboard, href:"/overview"},
  { name: "Reports", icon: FileText, href:"/reports" },
  { name: "Analytics", icon: BarChart3, href:"/analytics" },
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