using Microsoft.AspNetCore.Mvc;
using SplitSmart.API.DTOs;
using SplitSmart.API.Helpers;
using SplitSmart.API.Interfaces;

namespace SplitSmart.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseService _expenseService;
        private readonly JwtHelper _jwtHelper;

        public ExpenseController(IExpenseService expenseService, JwtHelper jwtHelper)
        {
            _expenseService = expenseService;
            _jwtHelper = jwtHelper;
        }

        private int? GetUserIdFromToken()
        {
            var authHeader = Request.Headers["Authorization"].ToString();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return null;
            }

            var token = authHeader.Substring("Bearer ".Length);
            return _jwtHelper.ValidateToken(token);
        }

        [HttpGet("group/{groupId}")]
        public async Task<ActionResult<List<ExpenseDto>>> GetGroupExpenses(int groupId)
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var expenses = await _expenseService.GetGroupExpenses(groupId, userId.Value);
            return Ok(expenses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseDto>> GetExpenseById(int id)
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var expense = await _expenseService.GetExpenseById(id, userId.Value);

            if (expense == null)
            {
                return NotFound(new { message = "Expense not found or access denied" });
            }

            return Ok(expense);
        }

        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> CreateExpense([FromBody] CreateExpenseDto createExpenseDto)
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var expense = await _expenseService.CreateExpense(createExpenseDto, userId.Value);

            if (expense == null)
            {
                return BadRequest(new { message = "Failed to create expense" });
            }

            return CreatedAtAction(nameof(GetExpenseById), new { id = expense.Id }, expense);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteExpense(int id)
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var result = await _expenseService.DeleteExpense(id, userId.Value);

            if (!result)
            {
                return BadRequest(new { message = "Failed to delete expense or access denied" });
            }

            return Ok(new { message = "Expense deleted successfully" });
        }

        [HttpGet("group/{groupId}/settlements")]
        public async Task<ActionResult<List<SettlementDto>>> CalculateSettlements(int groupId)
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var settlements = await _expenseService.CalculateSettlements(groupId, userId.Value);
            return Ok(settlements);
        }
    }
}