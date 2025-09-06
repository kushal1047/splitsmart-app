using Microsoft.AspNetCore.Mvc;
using SplitSmart.API.DTOs;
using SplitSmart.API.Helpers;
using SplitSmart.API.Interfaces;

namespace SplitSmart.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupController : ControllerBase
    {
        private readonly IGroupService _groupService;
        private readonly JwtHelper _jwtHelper;

        public GroupController(IGroupService groupService, JwtHelper jwtHelper)
        {
            _groupService = groupService;
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

        [HttpGet]
        public async Task<ActionResult<List<GroupDto>>> GetUserGroups()
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var groups = await _groupService.GetUserGroups(userId.Value);
            return Ok(groups);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GroupDetailDto>> GetGroupById(int id)
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var group = await _groupService.GetGroupById(id, userId.Value);

            if (group == null)
            {
                return NotFound(new { message = "Group not found or access denied" });
            }

            return Ok(group);
        }

        [HttpPost]
        public async Task<ActionResult<GroupDto>> CreateGroup([FromBody] CreateGroupDto createGroupDto)
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var group = await _groupService.CreateGroup(createGroupDto, userId.Value);

            if (group == null)
            {
                return BadRequest(new { message = "Failed to create group" });
            }

            return CreatedAtAction(nameof(GetGroupById), new { id = group.Id }, group);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateGroup(int id, [FromBody] UpdateGroupDto updateGroupDto)
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var result = await _groupService.UpdateGroup(id, updateGroupDto, userId.Value);

            if (!result)
            {
                return BadRequest(new { message = "Failed to update group or access denied" });
            }

            return Ok(new { message = "Group updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteGroup(int id)
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var result = await _groupService.DeleteGroup(id, userId.Value);

            if (!result)
            {
                return BadRequest(new { message = "Failed to delete group or access denied" });
            }

            return Ok(new { message = "Group deleted successfully" });
        }

        [HttpPost("{id}/members")]
        public async Task<ActionResult> AddMember(int id, [FromBody] AddMemberDto addMemberDto)
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var result = await _groupService.AddMember(id, addMemberDto, userId.Value);

            if (!result)
            {
                return BadRequest(new { message = "Failed to add member. User may not exist or is already a member" });
            }

            return Ok(new { message = "Member added successfully" });
        }

        [HttpDelete("{id}/members/{memberUserId}")]
        public async Task<ActionResult> RemoveMember(int id, int memberUserId)
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var result = await _groupService.RemoveMember(id, memberUserId, userId.Value);

            if (!result)
            {
                return BadRequest(new { message = "Failed to remove member or access denied" });
            }

            return Ok(new { message = "Member removed successfully" });
        }

        [HttpGet("{id}/balances")]
        public async Task<ActionResult<List<BalanceDto>>> GetGroupBalances(int id)
        {
            var userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }

            var balances = await _groupService.GetGroupBalances(id, userId.Value);
            return Ok(balances);
        }
    }
}