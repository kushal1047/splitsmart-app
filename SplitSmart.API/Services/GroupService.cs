using Microsoft.EntityFrameworkCore;
using SplitSmart.API.Data;
using SplitSmart.API.DTOs;
using SplitSmart.API.Interfaces;
using SplitSmart.API.Models;

namespace SplitSmart.API.Services
{
    public class GroupService : IGroupService
    {
        private readonly ApplicationDbContext _context;

        public GroupService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<GroupDto>> GetUserGroups(int userId)
        {
            var groups = await _context.GroupMembers
                .Where(gm => gm.UserId == userId)
                .Include(gm => gm.Group)
                    .ThenInclude(g => g.CreatedBy)
                .Include(gm => gm.Group)
                    .ThenInclude(g => g.Members)
                .Include(gm => gm.Group)
                    .ThenInclude(g => g.Expenses)
                .Select(gm => new GroupDto
                {
                    Id = gm.Group.Id,
                    Name = gm.Group.Name,
                    Description = gm.Group.Description,
                    CreatedById = gm.Group.CreatedById,
                    CreatedByName = gm.Group.CreatedBy.Name,
                    CreatedAt = gm.Group.CreatedAt,
                    MemberCount = gm.Group.Members.Count,
                    TotalExpenses = gm.Group.Expenses.Sum(e => e.Amount)
                })
                .ToListAsync();

            return groups;
        }

        public async Task<GroupDetailDto?> GetGroupById(int groupId, int userId)
        {
            // Check if user is a member
            var isMember = await _context.GroupMembers
                .AnyAsync(gm => gm.GroupId == groupId && gm.UserId == userId);

            if (!isMember)
            {
                return null;
            }

            var group = await _context.Groups
                .Include(g => g.CreatedBy)
                .Include(g => g.Members)
                    .ThenInclude(m => m.User)
                .Include(g => g.Expenses)
                    .ThenInclude(e => e.ExpenseSplits)
                .FirstOrDefaultAsync(g => g.Id == groupId);

            if (group == null)
            {
                return null;
            }

            var groupDetail = new GroupDetailDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                CreatedById = group.CreatedById,
                CreatedByName = group.CreatedBy.Name,
                CreatedAt = group.CreatedAt,
                TotalExpenses = group.Expenses.Sum(e => e.Amount),
                Members = group.Members.Select(m => new GroupMemberDto
                {
                    Id = m.Id,
                    UserId = m.UserId,
                    UserName = m.User.Name,
                    UserEmail = m.User.Email,
                    Role = m.Role,
                    JoinedAt = m.JoinedAt,
                    Balance = CalculateMemberBalance(groupId, m.UserId)
                }).ToList()
            };

            return groupDetail;
        }

        public async Task<GroupDto?> CreateGroup(CreateGroupDto createGroupDto, int userId)
        {
            var group = new Group
            {
                Name = createGroupDto.Name,
                Description = createGroupDto.Description,
                CreatedById = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Groups.Add(group);
            await _context.SaveChangesAsync();

            // Add creator as admin member
            var groupMember = new GroupMember
            {
                GroupId = group.Id,
                UserId = userId,
                Role = "Admin",
                JoinedAt = DateTime.UtcNow
            };

            _context.GroupMembers.Add(groupMember);
            await _context.SaveChangesAsync();

            var creator = await _context.Users.FindAsync(userId);

            return new GroupDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                CreatedById = group.CreatedById,
                CreatedByName = creator?.Name ?? "",
                CreatedAt = group.CreatedAt,
                MemberCount = 1,
                TotalExpenses = 0
            };
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