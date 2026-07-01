using backend.DTOs.Task;

namespace backend.Mappers
{
    public static class TaskMapper
    {
        public static TaskDto ToDto(this backend.Models.Task task)
        {
            return new TaskDto(
                task.Id,
                task.Title,
                task.Description!,
                task.Status,
                task.MilestoneId
            );
        }

        public static backend.Models.Task ToModel(this CreateTaskDto task)
        {
            return new backend.Models.Task
            {
                Title = task.Title,
                Description = task.Description!,
                // Status = task.Status,
                MilestoneId = task.MilestoneId,
            };
        }
    }
}
