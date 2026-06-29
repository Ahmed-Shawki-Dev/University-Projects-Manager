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

            var columns = new Dictionary<string, KanbanColumnDto>
            {
                {
                    "Todo",
                    new KanbanColumnDto(
                        "Todo",
                        "To Do",
                        tasks
                            .Where(t => t.Status == TaskStatusEnum.Todo.ToString())
                            .Select(t => t.Id)
                            .ToList()
                    )
                },
                {
                    "InProgress",
                    new KanbanColumnDto(
                        "InProgress",
                        "In Progress",
                        tasks
                            .Where(t => t.Status == TaskStatusEnum.InProgress.ToString())
                            .Select(t => t.Id)
                            .ToList()
                    )
                },
                {
                    "Review",
                    new KanbanColumnDto(
                        "Review",
                        "Review",
                        tasks.Where(t => t.Status == "Review").Select(t => t.Id).ToList()
                    )
                },
                {
                    "Done",
                    new KanbanColumnDto(
                        "Done",
                        "Done",
                        tasks.Where(t => t.Status == "Done").Select(t => t.Id).ToList()
                    )
                },
            };

            var columnOrder = new List<string> { "Todo", "InProgress", "Review", "Done" };

            if (tasks.Count == 0)
            {
                return Success(tasks, "No tasks assigned to this project yet.");
            }

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
