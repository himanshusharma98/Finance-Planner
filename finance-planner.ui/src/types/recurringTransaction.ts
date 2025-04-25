export interface RecurringTransaction {
    id?: number;
    username?: string;
    title: string;
    amount: number;
    category: string;
    type: "Income" | "Expense";
    frequency: "Daily" | "Weekly" | "Monthly";
    startDate: string;
    endDate?: string;
}
