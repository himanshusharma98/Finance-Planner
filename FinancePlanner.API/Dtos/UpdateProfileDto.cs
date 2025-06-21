namespace FinancePlanner.API.Dtos
{
    public class UpdateProfileDto
    {
        public string Email { get; set; } = "";
        public string PreferredCurrency { get; set; } = "₹";
        public string Theme { get; set; } = "light";
    }
}
