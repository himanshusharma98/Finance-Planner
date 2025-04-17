using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinancePlanner.API.Data;

namespace FinancePlanner.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly FinanceDbContext _context;

        public AnalyticsController(FinanceDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary([FromQuery] string? category, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = _context.Transactions.AsQueryable();

            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(t => t.Category == category);

            if (startDate.HasValue)
                query = query.Where(t => t.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(t => t.Date <= endDate.Value);

            var income = await query.Where(t => t.Type == "Income").SumAsync(t => t.Amount);
            var expense = await query.Where(t => t.Type == "Expense").SumAsync(t => t.Amount);

            return Ok(new
            {
                income,
                expense,
                balance = income - expense
            });
        }

        [HttpGet("category-summary")]
        public async Task<IActionResult> GetCategorySummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            // Get ALL distinct categories from the entire transaction table
            var allCategories = await _context.Transactions
                .Select(t => t.Category)
                .Distinct()
                .ToListAsync();

            // Build filtered query
            var filteredQuery = _context.Transactions.AsQueryable();

            if (startDate.HasValue)
                filteredQuery = filteredQuery.Where(t => t.Date >= startDate.Value);

            if (endDate.HasValue)
                filteredQuery = filteredQuery.Where(t => t.Date <= endDate.Value);

            // Group by category within date range for Expense type
            var expenseGroups = await filteredQuery
                .Where(t => t.Type == "Expense")
                .GroupBy(t => t.Category)
                .Select(g => new { Category = g.Key, Total = g.Sum(t => t.Amount) })
                .ToListAsync();

            // Merge with all categories, adding total = 0 for missing ones
            var result = allCategories
                .Select(category => new
                {
                    category,
                    total = expenseGroups.FirstOrDefault(g => g.Category == category)?.Total ?? 0
                })
                .ToList();

            return Ok(result);
        }

        [HttpGet("monthly-trend")]
        public async Task<IActionResult> GetMonthlyTrend([FromQuery] string? category, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = _context.Transactions.AsQueryable();

            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(t => t.Category == category);

            if (startDate.HasValue)
                query = query.Where(t => t.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(t => t.Date <= endDate.Value);

            var result = await query
                .GroupBy(t => new { t.Date.Year, t.Date.Month, t.Type })
                .Select(g => new
                {
                    year = g.Key.Year,
                    month = g.Key.Month,
                    type = g.Key.Type,
                    total = g.Sum(t => t.Amount)
                })
                .ToListAsync();

            return Ok(result);
        }
    }
}
