using Microsoft.AspNetCore.Mvc;
using SplitSmart.API.DTOs;
using SplitSmart.API.Interfaces;

namespace SplitSmart.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            var result = await _authService.Register(registerDto);

            if (result == null)
            {
                return BadRequest(new { message = "User with this email already exists" });
            }

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.Login(loginDto);

            if (result == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            return Ok(result);
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserProfileDto>> GetCurrentUser()
        {
            var authHeader = Request.Headers["Authorization"].ToString();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "No token provided" });
            }

            var token = authHeader.Substring("Bearer ".Length);
            var jwtHelper = new Helpers.JwtHelper(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
            var userId = jwtHelper.ValidateToken(token);

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var user = await _authService.GetUserById(userId.Value);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        [HttpPut("profile")]
        public async Task<ActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            var authHeader = Request.Headers["Authorization"].ToString();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "No token provided" });
            }

            var token = authHeader.Substring("Bearer ".Length);
            var jwtHelper = new Helpers.JwtHelper(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
            var userId = jwtHelper.ValidateToken(token);

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var result = await _authService.UpdateProfile(userId.Value, updateProfileDto.Name);

            if (!result)
            {
                return BadRequest(new { message = "Failed to update profile" });
            }

            var user = await _authService.GetUserById(userId.Value);
            return Ok(user);
        }

        [HttpPost("change-password")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            var authHeader = Request.Headers["Authorization"].ToString();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "No token provided" });
            }

            var token = authHeader.Substring("Bearer ".Length);
            var jwtHelper = new Helpers.JwtHelper(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
            var userId = jwtHelper.ValidateToken(token);

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var result = await _authService.ChangePassword(
                userId.Value,
                changePasswordDto.CurrentPassword,
                changePasswordDto.NewPassword
            );

            if (!result)
            {
                return BadRequest(new { message = "Current password is incorrect" });
            }

            return Ok(new { message = "Password changed successfully" });
        }
    }
}