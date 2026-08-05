using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record DoctorDto(Guid Id, string FullName,string Email, string? AcademicRank);

public record CreateDoctorDto(
    [Required] [EmailAddress] string Email,
    [Required] string FullName,
    string? AcademicRank,
    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        string Password
);
