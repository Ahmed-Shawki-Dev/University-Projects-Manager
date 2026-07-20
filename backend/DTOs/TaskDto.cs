using backend.Models;

namespace backend.DTOs;

public record TaskDto(
    Guid Id,
    string Title,
    string Description,
    TaskStatusEnum Status,
    Guid? MilestoneId,
    List<AssignedStudentDto> AssignedStudents
);

public record CreateTaskDto(
    string Title,
    string? Description,
    Guid? MilestoneId,
    List<Guid> StudentIds
);

public record UpdateTaskDto(
    string Title,
    string? Description,
    Guid? MilestoneId,
    List<Guid> StudentIds
);

public record UpdateTaskStatusDto(TaskStatusEnum Status);

public record AssignedStudentDto(Guid Id, string Name);
