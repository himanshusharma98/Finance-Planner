using System;
using System.ComponentModel.DataAnnotations;
namespace FinancePlanner.API.Models 
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public string Category { get; set; } = string.Empty;
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string Type { get; set; } = "Expense"; // "Income" or "Expense"
        public string? Notes { get; set; }
        public string UserId { get; set; } = string.Empty; // Foreign key to User
    }
}
