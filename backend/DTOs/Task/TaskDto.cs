using backend.Models;

namespace backend.DTOs.Task
{
    public record TaskDto(Guid Id, string Title, string Description, TaskStatusEnum Status);

    public record UpdateTaskStatusDto(TaskStatusEnum Status);
}
