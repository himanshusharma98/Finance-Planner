using Microsoft.AspNetCore.Mvc;
using FinancePlanner.API.Data;
using FinancePlanner.API.Dtos;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly FinanceDbContext _context;

    public UserController(FinanceDbContext context)
    {
        _context = context;
    }

    [HttpGet("profile")]
    public IActionResult GetProfile([FromQuery] string username)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username.ToLower() == username.ToLower());
        if (user == null) return NotFound("User not found.");

        return Ok(new UserProfileDto
        {
            Username = user.Username,
            Email = user.Email,
            PreferredCurrency = user.PreferredCurrency,
            Theme = user.Theme
        });
    }

    [HttpPut("update")]
    public IActionResult UpdateProfile([FromQuery] string username, [FromBody] UpdateProfileDto dto)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username.ToLower() == username.ToLower());
        if (user == null) return NotFound("User not found.");

        user.Email = dto.Email;
        user.PreferredCurrency = dto.PreferredCurrency;
        user.Theme = dto.Theme;

        _context.SaveChanges();
        return Ok("Profile updated successfully.");
    }

    [HttpPut("change-password")]
    public IActionResult ChangePassword([FromQuery] string username, [FromBody] ChangePasswordDto dto)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username.ToLower() == username.ToLower());
        if (user == null) return NotFound("User not found.");

        if (user.Password != dto.CurrentPassword)
            return BadRequest("Current password is incorrect.");

        user.Password = dto.NewPassword;
        _context.SaveChanges();
        return Ok("Password changed successfully.");
    }
}
