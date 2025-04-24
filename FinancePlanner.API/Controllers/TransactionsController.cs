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

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Transaction updatedTransaction)
        {
            var existingTransaction = await _context.Transactions.FindAsync(id);
            if (existingTransaction == null)
                return NotFound("Transaction not found.");

            // Only update fields, not ID
            existingTransaction.Title = updatedTransaction.Title;
            existingTransaction.Amount = updatedTransaction.Amount;
            existingTransaction.Category = updatedTransaction.Category;
            existingTransaction.Type = updatedTransaction.Type;
            existingTransaction.Date = updatedTransaction.Date;
            existingTransaction.Notes = updatedTransaction.Notes;

            await _context.SaveChangesAsync();
            return Ok(existingTransaction);
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
