using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record UserLoginDto([Required] [EmailAddress] string Email, [Required] string Password);
