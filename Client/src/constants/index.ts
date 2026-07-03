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