using backend.Data;
using backend.DTOs;
using backend.DTOs.Task;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route(
        "api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/tasks"
    )]
    public class TaskController(ApplicationDbContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetProjectTasks(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromRoute] string projectSlug
        )
        {
            var projectExists = await context
                .Projects.AsNoTracking()
                .AnyAsync(p =>
                    p.Slug == projectSlug
                    && p.Faculty.Slug == facultySlug
                    && p.Faculty.University.Slug == universitySlug
                );

            if (!projectExists)
            {
                return CustomNotFound(
                    $"Project with slug '{projectSlug}' was not found under the specified university and faculty.",
                    null
                );
            }

            var tasks = await context
                .Tasks.AsNoTracking()
                .Where(t => t.Project.Slug == projectSlug)
                .Select(t => t.ToDto())
                .ToListAsync();

            var columns = new Dictionary<TaskStatusEnum, KanbanColumnDto>
            {
                {
                    TaskStatusEnum.Todo,
                    new KanbanColumnDto(
                        TaskStatusEnum.Todo,
                        "To Do",
                        tasks.Where(t => t.Status == TaskStatusEnum.Todo).Select(t => t.Id).ToList()
                    )
                },
                {
                    TaskStatusEnum.InProgress,
                    new KanbanColumnDto(
                        TaskStatusEnum.InProgress,
                        "In Progress",
                        tasks
                            .Where(t => t.Status == TaskStatusEnum.InProgress)
                            .Select(t => t.Id)
                            .ToList()
                    )
                },
                {
                    TaskStatusEnum.Review,
                    new KanbanColumnDto(
                        TaskStatusEnum.Review,
                        "Review",
                        tasks
                            .Where(t => t.Status == TaskStatusEnum.Review)
                            .Select(t => t.Id)
                            .ToList()
                    )
                },
                {
                    TaskStatusEnum.Done,
                    new KanbanColumnDto(
                        TaskStatusEnum.Done,
                        "Done",
                        tasks.Where(t => t.Status == TaskStatusEnum.Done).Select(t => t.Id).ToList()
                    )
                },
            };

            var columnOrder = new List<TaskStatusEnum>()
            {
                TaskStatusEnum.Todo,
                TaskStatusEnum.InProgress,
                TaskStatusEnum.Review,
                TaskStatusEnum.Done,
            };

            return Success(
                new KanbanBoardDto(tasks, columns, columnOrder),
                "Tasks Retrieved Successfully"
            );
        }

        // ** Update Task Status
        [HttpPut("/api/tasks/{taskId}/status")]
        public async Task<IActionResult> UpdateStatus(
            [FromRoute] Guid taskId,
            [FromBody] UpdateTaskStatusDto updatedStatus
        )
        {
            var task = await context.Tasks.FindAsync(taskId);
            if (task == null)
                return CustomNotFound("Task Not Found", []);

            task.Status = updatedStatus.Status;

            await context.SaveChangesAsync();

            return Success(task.ToDto(), "Status Changed Successfully");
        }
    }
}
