using SplitSmart.API.DTOs;

namespace SplitSmart.API.Interfaces
{
    public interface IExpenseService
    {
        Task<List<ExpenseDto>> GetGroupExpenses(int groupId, int userId);
        Task<ExpenseDto?> GetExpenseById(int expenseId, int userId);
        Task<ExpenseDto?> CreateExpense(CreateExpenseDto createExpenseDto, int userId);
        Task<bool> DeleteExpense(int expenseId, int userId);
        Task<List<SettlementDto>> CalculateSettlements(int groupId, int userId);
    }
}