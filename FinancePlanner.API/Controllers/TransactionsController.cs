using Microsoft.AspNetCore.Mvc;
using FinancePlanner.API.Models;
using FinancePlanner.API.Data;
using Microsoft.EntityFrameworkCore;

namespace FinancePlanner.API.Controllers
{
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly FinanceDbContext _context;
        public TransactionsController(FinanceDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetAll()
        {
            return await _context.Transactions.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> Get(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }
            return transaction;
        }

        [HttpPost]
        public async Task<ActionResult<Transaction>> Create([FromBody] Transaction transaction)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = transaction.Id }, transaction);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound();

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
