using FinancePlanner.API.Data;
using FinancePlanner.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FinancePlanner.API.Services
{
    public class RecurringTransactionService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public RecurringTransactionService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<FinanceDbContext>();

                var now = DateTime.UtcNow.Date;
                var recurring = await context.RecurringTransactions
                    .Where(r => r.StartDate <= now && (!r.EndDate.HasValue || r.EndDate >= now))
                    .ToListAsync();

                foreach (var r in recurring)
                {
                    bool shouldRun = r.Frequency switch
                    {
                        "Daily" => (now - r.LastRunDate.Date).TotalDays >= 1,
                        "Weekly" => (now - r.LastRunDate.Date).TotalDays >= 7,
                        "Monthly" => r.LastRunDate.Month != now.Month || r.LastRunDate.Year != now.Year,
                        _ => false
                    };

                    if (shouldRun)
                    {
                        context.Transactions.Add(new Transaction
                        {
                            Title = r.Title,
                            Amount = r.Amount,
                            Category = r.Category,
                            Type = r.Type,
                            Date = now,
                            Notes = $"Auto-generated from Recurring ({r.Frequency})",
                            UserId = r.Username
                        });

                        r.LastRunDate = now;
                    }
                }

                await context.SaveChangesAsync();

                await Task.Delay(TimeSpan.FromHours(6), stoppingToken); // Run every 6 hours
            }
        }
    }

}
