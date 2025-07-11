﻿using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public async Task<IActionResult> GetGoals()
        {
            var goals = await _context.SavingsGoals.ToListAsync();
            return Ok(goals);
        }

        [HttpPost]
        public async Task<IActionResult> AddGoal(SavingsGoal goal)
        {
            if (string.IsNullOrWhiteSpace(goal.Username))
                goal.Username = "TestUser";

            _context.SavingsGoals.Add(goal);
            await _context.SaveChangesAsync();
            return Ok(goal);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGoal(int id, SavingsGoal updatedGoal)
        {
            var goal = await _context.SavingsGoals.FindAsync(id);
            if (goal == null) return NotFound();

            goal.Title = updatedGoal.Title;
            goal.TargetAmount = updatedGoal.TargetAmount;
            goal.SavedAmount = updatedGoal.SavedAmount;
            goal.Status = updatedGoal.Status;
            goal.TargetDate = updatedGoal.TargetDate;
            goal.Username = updatedGoal.Username;

            await _context.SaveChangesAsync();
            return Ok(goal);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoal(int id)
        {
            var goal = await _context.SavingsGoals.FindAsync(id);
            if (goal == null) return NotFound();

            _context.SavingsGoals.Remove(goal);
            await _context.SaveChangesAsync();
            return Ok("Goal deleted");
        }
    }
}
