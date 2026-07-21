import type { Transaction } from "../constants";

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;

  monthlyIncome: number;
  monthlyExpense: number;
  monthlyBalance: number;

  previousMonthBalance: number;
}

export interface ChartData {
  category: string;
  amount: number;
  fill: string;
  percentage: number;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  recentTransactions: Transaction[];
  chartData: ChartData[];
}