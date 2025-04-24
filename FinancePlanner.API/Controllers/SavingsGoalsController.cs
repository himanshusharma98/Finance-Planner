using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinancePlanner.API.Data;
using FinancePlanner.API.Models;

namespace FinancePlanner.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SavingGoalsController : ControllerBase
    {
        private readonly FinanceDbContext _context;

        public SavingGoalsController(FinanceDbContext context)
        {
            _context = context;
        }

        // GET: /api/SavingGoals
        [HttpGet]
        public async Task<IActionResult> GetGoals()
        {
            var goals = await _context.SavingsGoals.ToListAsync(); // no filtering yet
            return Ok(goals);
        }

        // POST: /api/SavingGoals
        [HttpPost]
        public async Task<IActionResult> AddGoal(SavingsGoal goal)
        {
            // ✅ temporarily hardcoded Username if Auth is disabled
            if (string.IsNullOrWhiteSpace(goal.Username))
                goal.Username = "TestUser";

            _context.SavingsGoals.Add(goal);
            await _context.SaveChangesAsync();
            return Ok(goal);
        }

        // PUT: /api/SavingGoals/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGoal(int id, SavingsGoal updatedGoal)
        {
            var goal = await _context.SavingsGoals.FindAsync(id);
            if (goal == null)
                return NotFound();

            goal.Title = updatedGoal.Title;
            goal.TargetAmount = updatedGoal.TargetAmount;
            goal.SavedAmount = updatedGoal.SavedAmount;
            goal.Status = updatedGoal.Status;
            goal.Username = updatedGoal.Username; // optional; if changed

            await _context.SaveChangesAsync();
            return Ok(goal);
        }

        // DELETE: /api/SavingGoals/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoal(int id)
        {
            var goal = await _context.SavingsGoals.FindAsync(id);
            if (goal == null)
                return NotFound();

            _context.SavingsGoals.Remove(goal);
            await _context.SaveChangesAsync();
            return Ok("Goal deleted");
        }
    }
}
