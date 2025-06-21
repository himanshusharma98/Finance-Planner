namespace FinancePlanner.API.Dtos
{
    public class UserProfileDto
    {
        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public string PreferredCurrency { get; set; } = "₹";
        public string Theme { get; set; } = "light";
    }
}
