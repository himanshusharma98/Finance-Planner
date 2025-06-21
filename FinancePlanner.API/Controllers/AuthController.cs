using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FinancePlanner.API.Dtos;
using FinancePlanner.API.Models;
using FinancePlanner.API.Data;

namespace FinancePlannerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly FinanceDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(FinanceDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ✅ REGISTER
        [HttpPost("register")]
        public IActionResult Register(UserRegisterDto request)
        {
            var existingUser = _context.Users.FirstOrDefault(u =>
                u.Username.ToLower() == request.Username.ToLower() ||
                u.Email.ToLower() == request.Email.ToLower());

            if (existingUser != null)
            {
                return BadRequest("User with the same username or email already exists.");
            }

            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                Password = request.Password // ⚠️ Note: plain text
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok("User registered successfully.");
        }

        // ✅ LOGIN
        [HttpPost("login")]
        public IActionResult Login(UserLoginDto request)
        {
            var user = _context.Users.FirstOrDefault(u =>
                (u.Username.ToLower() == request.Username.ToLower() ||
                 u.Email.ToLower() == request.Username.ToLower()) &&
                u.Password == request.Password);

            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            var token = CreateJwtToken(user);

            // ✅ Return token + username
            return Ok(new
            {
                token = token,
                username = user.Username
            });
        }

        // ✅ JWT TOKEN CREATION
        private string CreateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
