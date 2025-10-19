using SplitSmart.API.DTOs;

namespace SplitSmart.API.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> Register(RegisterDto registerDto);
        Task<AuthResponseDto?> Login(LoginDto loginDto);
        Task<UserProfileDto?> GetUserById(int userId);

        Task<bool> UpdateProfile(int userId, string name);
        Task<bool> ChangePassword(int userId, string currentPassword, string newPassword);
    }
}