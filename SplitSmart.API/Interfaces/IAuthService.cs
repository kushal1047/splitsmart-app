using SplitSmart.API.DTOs;

namespace SplitSmart.API.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> Register(RegisterDto registerDto);
        Task<AuthResponseDto?> Login(LoginDto loginDto);
        Task<UserProfileDto?> GetUserById(int userId);
    }
}