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
  Food: "darkorange",
  Transportation: "blueviolet",
  Shopping: "lightgreen",
  Bill: "blue",
  Upkeep: "crimson"

} as const;