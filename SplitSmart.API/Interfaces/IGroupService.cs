using SplitSmart.API.DTOs;

namespace SplitSmart.API.Interfaces
{
    public interface IGroupService
    {
        Task<List<GroupDto>> GetUserGroups(int userId);
        Task<GroupDetailDto?> GetGroupById(int groupId, int userId);
        Task<GroupDto?> CreateGroup(CreateGroupDto createGroupDto, int userId);
        Task<bool> UpdateGroup(int groupId, UpdateGroupDto updateGroupDto, int userId);
        Task<bool> DeleteGroup(int groupId, int userId);
        Task<bool> AddMember(int groupId, AddMemberDto addMemberDto, int userId);
        Task<bool> RemoveMember(int groupId, int memberUserId, int currentUserId);
        Task<List<BalanceDto>> GetGroupBalances(int groupId, int userId);
    }
}