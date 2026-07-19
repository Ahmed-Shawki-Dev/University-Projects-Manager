using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

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
    [Required] string Title,
    string? Description,
    [Range(
        0.01,
        999.99,
        ErrorMessage = "Max grade must be a positive number between 0.01 and 999.99."
    )]
        decimal MaxGrade,
    [Required] DateTime StartDate,
    [Required] DateTime DueDate
);

public record MilestoneWithTasksDto(
    Guid Id,
    string Title,
    string? Description,
    decimal MaxGrade,
    DateTime DueDate,
    List<TaskDto> Tasks
);
