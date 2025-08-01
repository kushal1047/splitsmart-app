using System.ComponentModel.DataAnnotations;

namespace SplitSmart.API.Models
{
    public class GroupMember
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int GroupId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } = "Member"; // Admin or Member

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Group Group { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}