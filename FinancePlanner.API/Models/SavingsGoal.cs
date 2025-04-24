namespace FinancePlanner.API.Models
{
    public class SavingsGoal
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public decimal TargetAmount { get; set; }
        public decimal SavedAmount { get; set; }
        public string Status { get; set; } = "Active";
    }
}
