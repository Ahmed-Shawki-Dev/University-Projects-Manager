using backend.DTOs.Task;

namespace backend.Mappers
{
    public static class TaskMapper
    {
        public static TaskDto ToDto(this backend.Models.Task task)
        {
            return new TaskDto(task.Id, task.Title, task.Description, task.Status.ToString());
        }
    }
}
