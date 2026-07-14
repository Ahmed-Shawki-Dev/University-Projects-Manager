using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record UserLoginDto([Required] [EmailAddress] string Email, [Required] string Password);

public record UserHeaderDto(
    string Email,
    string FullName,
    string UserRole,
    string? UniversitySlug,
    string? FacultySlug
);

public record LoginResponseDto(string Token, UserHeaderDto User);
