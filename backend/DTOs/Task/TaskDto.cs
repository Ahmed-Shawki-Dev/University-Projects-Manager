using backend.Models;

namespace backend.DTOs.Task
{
    public record TaskDto(
        Guid Id,
        string Title,
        string Description,
        TaskStatusEnum Status,
        Guid? MilestoneId
    );

    public record CreateTaskDto(string Title, string? Description, Guid? MilestoneId);

    public record UpdateTaskDto(string Title, string? Description, Guid? MilestoneId);

    public record UpdateTaskStatusDto(TaskStatusEnum Status);
}
