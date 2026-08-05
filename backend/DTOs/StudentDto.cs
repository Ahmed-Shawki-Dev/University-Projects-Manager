using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record StudentDto(Guid Id, string FullName, string Email, string StudentCode);
