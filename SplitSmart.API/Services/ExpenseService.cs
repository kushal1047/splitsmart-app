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
        public async Task<ExpenseDto?> CreateExpense(CreateExpenseDto createExpenseDto, int userId)
        {
            // Verify user is a member of the group
            var isMember = await _context.GroupMembers
                .AnyAsync(gm => gm.GroupId == createExpenseDto.GroupId && gm.UserId == userId);

            if (!isMember)
            {
                return null;
            }

            // Validate splits
            if (createExpenseDto.Splits == null || !createExpenseDto.Splits.Any())
            {
                return null;
            }

            // Create expense
            var expense = new Expense
            {
                GroupId = createExpenseDto.GroupId,
                Description = createExpenseDto.Description,
                Amount = createExpenseDto.Amount,
                Category = createExpenseDto.Category,
                PaidById = createExpenseDto.PaidById,
                SplitType = createExpenseDto.SplitType,
                ExpenseDate = createExpenseDto.ExpenseDate,
                CreatedAt = DateTime.UtcNow
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            // Create splits based on split type
            List<ExpenseSplit> splits = new List<ExpenseSplit>();

            if (createExpenseDto.SplitType == "Equal")
            {
                var splitAmount = Math.Round(createExpenseDto.Amount / createExpenseDto.Splits.Count, 2);
                var remainder = createExpenseDto.Amount - (splitAmount * createExpenseDto.Splits.Count);

                for (int i = 0; i < createExpenseDto.Splits.Count; i++)
                {
                    var split = createExpenseDto.Splits[i];
                    var amount = splitAmount;

                    // Add remainder to the first person
                    if (i == 0)
                    {
                        amount += remainder;
                    }

                    splits.Add(new ExpenseSplit
                    {
                        ExpenseId = expense.Id,
                        UserId = split.UserId,
                        Amount = amount,
                        Percentage = null,
                        IsPaid = split.UserId == createExpenseDto.PaidById
                    });
                }
            }
            else if (createExpenseDto.SplitType == "Unequal")
            {
                foreach (var split in createExpenseDto.Splits)
                {
                    splits.Add(new ExpenseSplit
                    {
                        ExpenseId = expense.Id,
                        UserId = split.UserId,
                        Amount = split.Amount ?? 0,
                        Percentage = null,
                        IsPaid = split.UserId == createExpenseDto.PaidById
                    });
                }
            }
            else if (createExpenseDto.SplitType == "Percentage")
            {
                foreach (var split in createExpenseDto.Splits)
                {
                    var amount = Math.Round(createExpenseDto.Amount * (split.Percentage ?? 0) / 100, 2);
                    splits.Add(new ExpenseSplit
                    {
                        ExpenseId = expense.Id,
                        UserId = split.UserId,
                        Amount = amount,
                        Percentage = split.Percentage,
                        IsPaid = split.UserId == createExpenseDto.PaidById
                    });
                }
            }

            _context.ExpenseSplits.AddRange(splits);
            await _context.SaveChangesAsync();

            return await GetExpenseById(expense.Id, userId);
        }

        public async Task<bool> DeleteExpense(int expenseId, int userId)
        {
            var expense = await _context.Expenses
                .Include(e => e.Group)
                .FirstOrDefaultAsync(e => e.Id == expenseId);

            if (expense == null)
            {
                return false;
            }

            // Check if user is creator or group admin
            var isAdmin = await _context.GroupMembers
                .AnyAsync(gm => gm.GroupId == expense.GroupId &&
                               gm.UserId == userId &&
                               gm.Role == "Admin");

            var isCreator = expense.PaidById == userId;

            if (!isAdmin && !isCreator)
            {
                return false;
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<SettlementDto>> CalculateSettlements(int groupId, int userId)
        {
            // Check if user is a member
            var isMember = await _context.GroupMembers
                .AnyAsync(gm => gm.GroupId == groupId && gm.UserId == userId);

            if (!isMember)
            {
                return new List<SettlementDto>();
            }

            // Get all members and their balances
            var members = await _context.GroupMembers
                .Where(gm => gm.GroupId == groupId)
                .Include(gm => gm.User)
                .ToListAsync();

            var balances = new Dictionary<int, decimal>();

            foreach (var member in members)
            {
                balances[member.UserId] = CalculateMemberBalance(groupId, member.UserId);
            }

            // Separate who owes and who is owed
            var owes = balances.Where(b => b.Value < 0)
                               .OrderBy(b => b.Value)
                               .ToDictionary(b => b.Key, b => -b.Value);

            var owed = balances.Where(b => b.Value > 0)
                               .OrderByDescending(b => b.Value)
                               .ToDictionary(b => b.Key, b => b.Value);

            var settlements = new List<SettlementDto>();

            // Calculate minimal transactions
            var owesQueue = new Queue<KeyValuePair<int, decimal>>(owes);
            var owedQueue = new Queue<KeyValuePair<int, decimal>>(owed);

            while (owesQueue.Any() && owedQueue.Any())
            {
                var debtor = owesQueue.Dequeue();
                var creditor = owedQueue.Dequeue();

                var amount = Math.Min(debtor.Value, creditor.Value);

                var debtorUser = members.First(m => m.UserId == debtor.Key).User;
                var creditorUser = members.First(m => m.UserId == creditor.Key).User;

                settlements.Add(new SettlementDto
                {
                    FromUserId = debtor.Key,
                    FromUserName = debtorUser.Name,
                    ToUserId = creditor.Key,
                    ToUserName = creditorUser.Name,
                    Amount = Math.Round(amount, 2)
                });

                // Put back any remaining balance
                if (debtor.Value > creditor.Value)
                {
                    owesQueue.Enqueue(new KeyValuePair<int, decimal>(debtor.Key, debtor.Value - amount));
                }
                else if (creditor.Value > debtor.Value)
                {
                    owedQueue.Enqueue(new KeyValuePair<int, decimal>(creditor.Key, creditor.Value - amount));
                }
            }

            return settlements;
        }

        private decimal CalculateMemberBalance(int groupId, int userId)
        {
            var expenses = _context.Expenses
                .Where(e => e.GroupId == groupId)
                .Include(e => e.ExpenseSplits)
                .ToList();

            decimal balance = 0;

            foreach (var expense in expenses)
            {
                // If user paid
                if (expense.PaidById == userId)
                {
                    balance += expense.Amount;
                }

                // If user owes
                var split = expense.ExpenseSplits.FirstOrDefault(s => s.UserId == userId);
                if (split != null)
                {
                    balance -= split.Amount;
                }
            }

            return balance;
        }

    }
}