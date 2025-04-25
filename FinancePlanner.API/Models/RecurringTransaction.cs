namespace FinancePlanner.API.Models
{
    public class RecurringTransaction
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Type { get; set; } = "Expense"; // or "Income"
        public string Frequency { get; set; } = "Monthly"; // Weekly, Monthly, Yearly
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime LastRunDate { get; set; }
    }

}
