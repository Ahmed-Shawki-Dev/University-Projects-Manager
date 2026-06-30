namespace backend.DTOs.Milestone
{
    public record MilestoneDto(
        Guid Id,
        string Title,
        string? Description,
        decimal MaxGrade,
        DateTime StartDate,
        DateTime DueDate,
        Guid ProjectId
    );

    public record CreateMilestoneDto(
        string Title,
        string? Description,
        decimal MaxGrade,
        DateTime DueDate
    );
}
