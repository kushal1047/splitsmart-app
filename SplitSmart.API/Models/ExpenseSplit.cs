using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SplitSmart.API.Models
{
    public class ExpenseSplit
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ExpenseId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? Percentage { get; set; }

        public bool IsPaid { get; set; } = false;

        public DateTime? PaidAt { get; set; }

        // Navigation properties
        public Expense Expense { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}