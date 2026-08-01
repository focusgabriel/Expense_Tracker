import type { Transaction } from "../constants";
import { CATEGORY_COLORS } from "../constants";
import type { ChartData, DashboardResponse, DashboardSummary } from "../types/dashboard";
import type { User } from "../lib/AuthContext";

const STORAGE_KEY = "trackiu:transactions";
const AUTH_KEY = "trackiu:auth";
const PENDING_OPS_KEY = "trackiu:pending-ops";

export type StoredTransaction = Transaction & {
  _id: string;
  pending?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PendingOperation = {
  id: string;
  type: "create" | "update" | "delete";
  transaction: StoredTransaction;
  timestamp: number;
  retries: number;
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const toStorageDate = (value?: string | Date) => {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return value.toISOString();
};

// ==================== Auth Persistence ====================

export const saveAuthLocally = (user: User) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch {
    // Storage full or unavailable
  }
};

export const getStoredAuth = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const clearAuthLocally = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_KEY);
  } catch {
    // Ignore
  }
};

// ==================== Transaction Storage ====================

const readTransactions = (): StoredTransaction[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredTransaction[]) : [];
  } catch {
    return [];
  }
};

const writeTransactions = (transactions: StoredTransaction[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const getStoredTransactions = (): StoredTransaction[] => {
  return [...readTransactions()].sort((a, b) => {
    const aDate = new Date(a.createdAt ?? a.created_date ?? 0).getTime();
    const bDate = new Date(b.createdAt ?? b.created_date ?? 0).getTime();
    return bDate - aDate;
  });
};

export const getStoredTransactionById = (id: string): StoredTransaction | undefined => {
  return readTransactions().find((item) => item._id === id);
};

export const saveTransactionLocally = (
  transaction: Transaction,
  pending = true
): StoredTransaction => {
  const normalized: StoredTransaction = {
    ...transaction,
    _id: (transaction as StoredTransaction)._id || createId(),
    pending,
    createdAt: (transaction as StoredTransaction).createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    date: toStorageDate(transaction.date),
    created_date: toStorageDate(transaction.created_date),
  };

  const existing = readTransactions().filter((item) => item._id !== normalized._id);
  const next = [normalized, ...existing];
  writeTransactions(next);

  return normalized;
};

export const updateTransactionLocally = (
  id: string,
  updates: Partial<Transaction>
): StoredTransaction | null => {
  const transactions = readTransactions();
  const index = transactions.findIndex((item) => item._id === id);

  if (index === -1) return null;

  transactions[index] = {
    ...transactions[index],
    ...updates,
    _id: id,
    updatedAt: new Date().toISOString(),
    pending: true,
    date: updates.date ? toStorageDate(updates.date) : transactions[index].date,
    created_date: updates.created_date
      ? toStorageDate(updates.created_date)
      : transactions[index].created_date,
  };

  writeTransactions(transactions);
  return transactions[index];
};

export const setTransactionSyncStatus = (id: string | undefined, pending: boolean) => {
  if (!id) {
    return;
  }

  const transactions = readTransactions().map((item) =>
    item._id === id ? { ...item, pending, updatedAt: new Date().toISOString() } : item
  );

  writeTransactions(transactions);
};

export const removeStoredTransaction = (id?: string) => {
  if (!id) {
    return;
  }

  const transactions = readTransactions().filter((item) => item._id !== id);
  writeTransactions(transactions);
};

export const isBrowserOnline = () => {
  return typeof navigator === "undefined" ? true : navigator.onLine;
};

export const getPendingTransactions = () => {
  return getStoredTransactions().filter((transaction) => transaction.pending);
};

// ==================== Pending Operations Queue ====================

const readPendingOps = (): PendingOperation[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PENDING_OPS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PendingOperation[];
  } catch {
    return [];
  }
};

const writePendingOps = (ops: PendingOperation[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_OPS_KEY, JSON.stringify(ops));
};

export const addPendingOperation = (op: Omit<PendingOperation, "timestamp" | "retries">) => {
  const ops = readPendingOps();
  // Remove any existing operation with the same id and type
  const filtered = ops.filter((o) => !(o.id === op.id && o.type === op.type));
  filtered.push({
    ...op,
    timestamp: Date.now(),
    retries: 0,
  });
  writePendingOps(filtered);
};

export const removePendingOperation = (id: string, type: PendingOperation["type"]) => {
  const ops = readPendingOps().filter((o) => !(o.id === id && o.type === type));
  writePendingOps(ops);
};

export const getPendingOperations = (): PendingOperation[] => {
  return readPendingOps().sort((a, b) => a.timestamp - b.timestamp);
};

export const incrementRetry = (id: string, type: PendingOperation["type"]): boolean => {
  const ops = readPendingOps();
  const index = ops.findIndex((o) => o.id === id && o.type === type);
  if (index === -1) return false;

  ops[index].retries += 1;
  // If too many retries (more than 10), remove the operation
  if (ops[index].retries > 10) {
    ops.splice(index, 1);
    writePendingOps(ops);
    return false;
  }

  writePendingOps(ops);
  return true;
};

// ==================== Sync Service ====================

export const syncPendingOperations = async (): Promise<{ synced: number; failed: number }> => {
  if (!isBrowserOnline()) return { synced: 0, failed: 0 };

  const { default: refreshClient } = await import("../api/fetch");
  const ops = getPendingOperations();
  let synced = 0;
  let failed = 0;

  for (const op of ops) {
    try {
      switch (op.type) {
        case "create": {
          await refreshClient.post("/addTransaction", {
            type: op.transaction.type,
            amount: Number(op.transaction.amount || 0),
            category: op.transaction.category,
            description: op.transaction.description,
            date: op.transaction.date,
            created_date: op.transaction.created_date,
          });
          break;
        }
        case "update": {
          await refreshClient.patch(`/updateTransaction/${op.id}`, {
            type: op.transaction.type,
            amount: Number(op.transaction.amount || 0),
            category: op.transaction.category,
            description: op.transaction.description,
            date: op.transaction.date,
            created_date: op.transaction.created_date,
          });
          break;
        }
        case "delete": {
          await refreshClient.delete(`/deleteTransaction/${op.id}`);
          break;
        }
      }

      // Remove the operation from the queue on success
      removePendingOperation(op.id, op.type);
      // Also update sync status on the stored transaction
      if (op.type !== "delete") {
        setTransactionSyncStatus(op.id, false);
      } else {
        removeStoredTransaction(op.id);
      }
      synced++;
    } catch {
      // Increment retry count, remove if too many retries
      const shouldRetry = incrementRetry(op.id, op.type);
      if (!shouldRetry) {
        failed++;
      }
    }
  }

  return { synced, failed };
};

// ==================== Dashboard Data ====================

const getTransactionDate = (item: StoredTransaction) => {
  const value = item.date ?? item.created_date;

  if (!value) {
    return new Date(0);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split("-").map(Number);
      return new Date(year, (month || 1) - 1, day || 1);
    }

    return new Date(trimmed);
  }

  return value;
};

export const getLocalDashboardData = (): DashboardResponse => {
  const transactions = getStoredTransactions();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const firstDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

  const monthlyTransactions = transactions.filter((item) => {
    const transactionDate = getTransactionDate(item);
    return transactionDate >= firstDayOfMonth && transactionDate < firstDayOfNextMonth;
  });

  const previousMonthTransactions = transactions.filter((item) => {
    const transactionDate = getTransactionDate(item);
    return transactionDate >= firstDayOfPreviousMonth && transactionDate < firstDayOfCurrentMonth;
  });

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const monthlyIncome = monthlyTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const monthlyExpense = monthlyTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const previousMonthIncome = previousMonthTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const previousMonthExpense = previousMonthTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const recentTransactions = [...transactions]
    .sort((a, b) => {
      const aDate = new Date(a.created_date ?? a.date ?? 0).getTime();
      const bDate = new Date(b.created_date ?? b.date ?? 0).getTime();
      return bDate - aDate;
    })
    .slice(0, 5);

  const groupedExpenses = monthlyTransactions
    .filter((item) => item.type === "expense")
    .reduce<Record<string, number>>((acc, item) => {
      const category = (item.category || "others").toLowerCase();
      acc[category] = (acc[category] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

  const get_expense = monthlyExpense;
  const get_income = monthlyIncome;

  const chartData: ChartData[] = Object.entries(groupedExpenses)
    .map(([category, amount]) => ({
      category,
      amount,
      fill: (CATEGORY_COLORS as Record<string, string>)[category] || "#818CF8",
      percentage: get_income > 0 ? Number(((amount / get_income) * 100).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const summary: DashboardSummary = {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    monthlyIncome,
    monthlyExpense,
    monthlyBalance: monthlyIncome - monthlyExpense,
    previousMonthBalance: previousMonthIncome - previousMonthExpense,
    previousMonthIncome,
    previousMonthExpense,
  };

  return {
    authenticatedUser: {
      name: "Offline user",
      email: "offline@local",
    },
    summary,
    recentTransactions,
    chartData,
    get_expense,
    get_income,
    monthlyBalance: monthlyIncome - monthlyExpense,
    firstDayOfCurrentMonth: firstDayOfCurrentMonth.toISOString(),
    endOfLastMonth,
  };
};

export const getLocalMonthlyReport = (monthKey?: string) => {
  const transactions = getStoredTransactions();
  const now = new Date();
  let selectedYear = now.getFullYear();
  let selectedMonth = now.getMonth();

  if (monthKey && /^\d{4}-\d{2}$/.test(monthKey)) {
    const [year, month] = monthKey.split("-").map(Number);
    selectedYear = year;
    selectedMonth = month - 1;
  }

  const startOfSelectedMonth = new Date(selectedYear, selectedMonth, 1);
  const startOfNextMonth = new Date(selectedYear, selectedMonth + 1, 1);
  const startOfPreviousMonth = new Date(selectedYear, selectedMonth - 1, 1);
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const selectedMonthTransactions = transactions.filter((item) => {
    const value = getTransactionDate(item);
    return value >= startOfSelectedMonth && value < startOfNextMonth;
  });

  const previousMonthTransactions = transactions.filter((item) => {
    const value = getTransactionDate(item);
    return value >= startOfPreviousMonth && value < startOfSelectedMonth;
  });

  const get_expense = selectedMonthTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const get_income = selectedMonthTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const previousIncome = previousMonthTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const previousExpense = previousMonthTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return {
    get_expense,
    get_income,
    netbalance: get_income - get_expense,
    lastMonthNetBalance: previousIncome - previousExpense,
    endOfLastMonth: startOfNextMonth.toISOString(),
    month: monthKey || `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`,
    selectedMonthStart: startOfSelectedMonth.toISOString(),
    selectedMonthEnd: startOfNextMonth.toISOString(),
    isCurrentMonth: startOfSelectedMonth.getTime() === startOfCurrentMonth.getTime(),
  };
};