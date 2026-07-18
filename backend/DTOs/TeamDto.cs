namespace backend.DTOs;

public record TeamMemberDto(string Name, string Email, bool IsLeader, bool IsMe);
