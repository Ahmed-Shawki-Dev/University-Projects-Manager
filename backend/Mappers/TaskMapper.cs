using backend.DTOs;
using backend.Models;

namespace backend.Mappers
{
    public static class TaskMapper
    {
        public static TaskDto ToDto(this Models.Task task)
        {
            return new TaskDto(
                task.Id,
                task.Title,
                task.Description!,
                task.Status,
                task.MilestoneId,
                task.TaskStudents.Select(ts => new AssignedStudentDto(
                        ts.StudentId,
                        ts.Student.User.FullName
                    ))
                    .ToList()
            );
        }

        public static Models.Task ToModel(this CreateTaskDto task)
        {
            return new Models.Task
            {
                Title = task.Title,
                Description = task.Description!,
                MilestoneId = task.MilestoneId,
                TaskStudents = task
                    .StudentIds.Select(id => new TaskStudent { StudentId = id })
                    .ToList(),
            };
        }
    }
}
