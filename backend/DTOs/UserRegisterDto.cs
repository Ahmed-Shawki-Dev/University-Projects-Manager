using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record UserRegisterDto(
    [Required] [EmailAddress] string Email,
    [Required] string FullName,
    [Required] string StudentCode,
    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        string Password
);

public record RegisterResponseDto(string Email, string FullName, string StudentCode);
