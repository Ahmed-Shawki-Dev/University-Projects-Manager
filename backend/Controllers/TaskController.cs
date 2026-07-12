using backend.Data;
using backend.DTOs;
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
        // ** Get All Tasks
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

        // ** Get Task By Id
        [HttpGet("/api/tasks/{taskId}")]
        public async Task<IActionResult> GetById(Guid taskId)
        {
            var task = await context.Tasks.FindAsync(taskId);
            if (task == null)
            {
                return CustomNotFound("Task Not Found", []);
            }
            return Success(task.ToDto(), "Task Retrieved Successfully");
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

        // ** Create Task
        [HttpPost(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/tasks"
        )]
        public async Task<IActionResult> CreateTask(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromRoute] string projectSlug,
            [FromBody] CreateTaskDto task
        )
        {
            var project = await context.Projects.FirstOrDefaultAsync(p =>
                p.Faculty.University.Slug == universitySlug
                && p.Faculty.Slug == facultySlug
                && p.Slug == projectSlug
            );

            if (project == null)
            {
                return CustomNotFound("Project Not Found", []);
            }

            if (task.MilestoneId.HasValue)
            {
                var milestoneExists = await context.Milestones.AnyAsync(m =>
                    m.Id == task.MilestoneId.Value && m.ProjectId == project.Id
                );
                if (!milestoneExists)
                {
                    return CustomBadRequest(
                        "The specified Milestone does not exist or does not belong to this project.",
                        []
                    );
                }
            }

            var taskModel = task.ToModel();
            taskModel.ProjectId = project.Id;

            context.Tasks.Add(taskModel);
            await context.SaveChangesAsync();

            return CustomCreateAtAction(
                nameof(GetById),
                new
                {
                    universitySlug,
                    facultySlug,
                    taskId = taskModel.Id,
                },
                taskModel.ToDto(),
                "Task Created Successfully"
            );
        }

        // ** Delete Task
        [HttpDelete("/api/tasks/{taskId}")]
        public async Task<IActionResult> RemoveTask(Guid taskId)
        {
            var task = await context.Tasks.FindAsync(taskId);
            if (task == null)
            {
                return CustomNotFound("Task Not Found", []);
            }

            context.Tasks.Remove(task);
            await context.SaveChangesAsync();
            return NoContent();
        }

        // ** Update Task
        [HttpPut("/api/tasks/{taskId}")]
        public async Task<IActionResult> UpdateTask(
            Guid taskId,
            [FromBody] UpdateTaskDto updateTask
        )
        {
            var taskModel = await context.Tasks.FindAsync(taskId);
            if (taskModel == null)
            {
                return CustomNotFound("Task Not Found", []);
            }

            taskModel.Title = updateTask.Title;
            taskModel.Description = updateTask.Description;

            if (updateTask.MilestoneId.HasValue)
            {
                var isMilestoneExist = await context.Milestones.AnyAsync(m =>
                    m.Id == updateTask.MilestoneId.Value
                );

                if (!isMilestoneExist)
                {
                    return CustomBadRequest("The specified Milestone does not exist.", []);
                }
            }
            taskModel.MilestoneId = updateTask.MilestoneId;

            await context.SaveChangesAsync();

            return Success(taskModel.ToDto(), "Task Updated Successfully");
        }
    }
}
