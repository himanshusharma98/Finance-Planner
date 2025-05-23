﻿using Microsoft.EntityFrameworkCore;
using FinancePlanner.API.Models;

namespace FinancePlanner.API.Data
{
    public class FinanceDbContext : DbContext
    {
        public FinanceDbContext(DbContextOptions<FinanceDbContext> options) : base(options) { }

        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<SavingsGoal> SavingsGoals { get; set; }
        public DbSet<RecurringTransaction> RecurringTransactions { get; set; }

    }
}
