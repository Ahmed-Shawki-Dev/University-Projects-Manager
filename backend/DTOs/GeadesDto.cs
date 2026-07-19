namespace backend.DTOs;

public record StudentMilestoneGradeDto(
    Guid StudentId,
    string FullName,
    string Email,
    decimal? CurrentGrade
);

public record SubmitStudentGradeDto(Guid StudentId, decimal Grade);
