using Microsoft.EntityFrameworkCore;
using SplitSmart.API.Data;
using SplitSmart.API.DTOs;
using SplitSmart.API.Interfaces;
using SplitSmart.API.Models;

namespace SplitSmart.API.Services
{
    public class ExpenseService : IExpenseService
    {
        private readonly ApplicationDbContext _context;

        public ExpenseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ExpenseDto>> GetGroupExpenses(int groupId, int userId)
        {
            // Check if user is a member
            var isMember = await _context.GroupMembers
                .AnyAsync(gm => gm.GroupId == groupId && gm.UserId == userId);

            if (!isMember)
            {
                return new List<ExpenseDto>();
            }

            var expenses = await _context.Expenses
                .Where(e => e.GroupId == groupId)
                .Include(e => e.Group)
                .Include(e => e.PaidBy)
                .Include(e => e.ExpenseSplits)
                    .ThenInclude(es => es.User)
                .OrderByDescending(e => e.ExpenseDate)
                .Select(e => new ExpenseDto
                {
                    Id = e.Id,
                    GroupId = e.GroupId,
                    GroupName = e.Group.Name,
                    Description = e.Description,
                    Amount = e.Amount,
                    Category = e.Category,
                    PaidById = e.PaidById,
                    PaidByName = e.PaidBy.Name,
                    SplitType = e.SplitType,
                    ExpenseDate = e.ExpenseDate,
                    CreatedAt = e.CreatedAt,
                    Splits = e.ExpenseSplits.Select(es => new ExpenseSplitDto
                    {
                        Id = es.Id,
                        UserId = es.UserId,
                        UserName = es.User.Name,
                        Amount = es.Amount,
                        Percentage = es.Percentage,
                        IsPaid = es.IsPaid,
                        PaidAt = es.PaidAt
                    }).ToList()
                })
                .ToListAsync();

            return expenses;
        }

        public async Task<ExpenseDto?> GetExpenseById(int expenseId, int userId)
        {
            var expense = await _context.Expenses
                .Include(e => e.Group)
                .Include(e => e.PaidBy)
                .Include(e => e.ExpenseSplits)
                    .ThenInclude(es => es.User)
                .FirstOrDefaultAsync(e => e.Id == expenseId);

            if (expense == null)
            {
                return null;
            }

            // Check if user is a member of the group
            var isMember = await _context.GroupMembers
                .AnyAsync(gm => gm.GroupId == expense.GroupId && gm.UserId == userId);

            if (!isMember)
            {
                return null;
            }

            return new ExpenseDto
            {
                Id = expense.Id,
                GroupId = expense.GroupId,
                GroupName = expense.Group.Name,
                Description = expense.Description,
                Amount = expense.Amount,
                Category = expense.Category,
                PaidById = expense.PaidById,
                PaidByName = expense.PaidBy.Name,
                SplitType = expense.SplitType,
                ExpenseDate = expense.ExpenseDate,
                CreatedAt = expense.CreatedAt,
                Splits = expense.ExpenseSplits.Select(es => new ExpenseSplitDto
                {
                    Id = es.Id,
                    UserId = es.UserId,
                    UserName = es.User.Name,
                    Amount = es.Amount,
                    Percentage = es.Percentage,
                    IsPaid = es.IsPaid,
                    PaidAt = es.PaidAt
                }).ToList()
            };
        }
    }
}