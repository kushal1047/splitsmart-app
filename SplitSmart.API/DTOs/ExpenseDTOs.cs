using System.ComponentModel.DataAnnotations;

namespace SplitSmart.API.DTOs
{
    public class CreateExpenseDto
    {
        [Required]
        public int GroupId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public string Category { get; set; } = "General";

        [Required]
        public int PaidById { get; set; }

        [Required]
        public string SplitType { get; set; } = "Equal";

        public DateTime ExpenseDate { get; set; } = DateTime.UtcNow;

        [Required]
        public List<ExpenseSplitInputDto> Splits { get; set; } = new();
    }

    public class ExpenseSplitInputDto
    {
        [Required]
        public int UserId { get; set; }

        public decimal? Amount { get; set; }

        public decimal? Percentage { get; set; }
    }

    public class ExpenseDto
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Category { get; set; } = string.Empty;
        public int PaidById { get; set; }
        public string PaidByName { get; set; } = string.Empty;
        public string SplitType { get; set; } = string.Empty;
        public DateTime ExpenseDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ExpenseSplitDto> Splits { get; set; } = new();
    }

    public class ExpenseSplitDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal? Percentage { get; set; }
        public bool IsPaid { get; set; }
        public DateTime? PaidAt { get; set; }
    }

    public class BalanceDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public decimal Balance { get; set; }
    }

    public class SettlementDto
    {
        public int FromUserId { get; set; }
        public string FromUserName { get; set; } = string.Empty;
        public int ToUserId { get; set; }
        public string ToUserName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}