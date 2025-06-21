
namespace FinancePlanner.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } // Stored as plain text (as per your request)
        public string PreferredCurrency { get; set; } = "₹";
        public string Theme { get; set; } = "light"; // "dark" or "light"
    }


}