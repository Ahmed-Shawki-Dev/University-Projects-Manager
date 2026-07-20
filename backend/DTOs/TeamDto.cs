namespace backend.DTOs;

public record TeamMemberDto(Guid Id, string Name, string Email, bool IsLeader, bool IsMe);
