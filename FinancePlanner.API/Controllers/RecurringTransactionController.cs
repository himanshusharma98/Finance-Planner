using FinancePlanner.API.Data;
using FinancePlanner.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinancePlanner.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecurringTransactionController : ControllerBase
    {
        private readonly FinanceDbContext _context;

        public RecurringTransactionController(FinanceDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.RecurringTransactions.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(RecurringTransaction transaction)
        {
            transaction.LastRunDate = transaction.StartDate;
            _context.RecurringTransactions.Add(transaction);
            await _context.SaveChangesAsync();
            return Ok(transaction);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var transaction = await _context.RecurringTransactions.FindAsync(id);
            if (transaction == null) return NotFound();
            _context.RecurringTransactions.Remove(transaction);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }

}
