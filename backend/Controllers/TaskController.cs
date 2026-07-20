using backend.Data;
using backend.DTOs;
using backend.Mappers;
using backend.Models;
using backend.Utils;
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
            if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
            {
                return Forbid();
            }

            var projectExists = await context
                .Projects.AsNoTracking()
                .AnyAsync(p => p.Slug == projectSlug && p.Faculty.Slug == facultySlug);

            if (!projectExists)
            {
                return CustomNotFound(
                    $"Project with slug '{projectSlug}' was not found under the specified university and faculty.",
                    null
                );
            }

            var tasksEntities = await context
                .Tasks.AsNoTracking()
                .Include(t => t.TaskStudents)
                    .ThenInclude(ts => ts.Student)
                        .ThenInclude(s => s.User)
                .Where(t => t.Project.Slug == projectSlug && t.Project.Faculty.Slug == facultySlug)
                .ToListAsync();

            var tasks = tasksEntities.Select(t => t.ToDto()).ToList();

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
            if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
            {
                return Forbid();
            }

            var project = await context
                .Projects.Include(p => p.Team)
                .FirstOrDefaultAsync(p => p.Faculty.Slug == facultySlug && p.Slug == projectSlug);

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

            if (task.StudentIds.Count > 0)
            {
                var validStudentsCount = await context
                    .StudentTeams.Where(st =>
                        st.TeamId == project.Team!.Id && task.StudentIds.Contains(st.StudentId)
                    )
                    .CountAsync();

                if (task.StudentIds.Count != validStudentsCount)
                {
                    return CustomBadRequest(
                        "All assigned students must be members of the specified project team.",
                        []
                    );
                }
            }

            var taskModel = task.ToModel();
            taskModel.ProjectId = project.Id;

            context.Tasks.Add(taskModel);
            await context.SaveChangesAsync();

            var createdTaskDto = await context
                .Tasks.Where(t => t.Id == taskModel.Id)
                .Select(t => new TaskDto(
                    t.Id,
                    t.Title,
                    t.Description ?? "",
                    t.Status,
                    t.MilestoneId,
                    t.TaskStudents.Select(ts => new AssignedStudentDto(
                            ts.StudentId,
                            ts.Student.User.FullName
                        ))
                        .ToList()
                ))
                .FirstOrDefaultAsync();

            return CustomCreateAtAction(
                nameof(GetById),
                new
                {
                    universitySlug,
                    facultySlug,
                    taskId = taskModel.Id,
                },
                createdTaskDto,
                "Task Created Successfully"
            );
        }

        // ** Delete Task
        [HttpDelete("/api/tasks/{taskId}")]
        public async Task<IActionResult> RemoveTask(Guid taskId)
        {
            var deletedCount = await context.Tasks.Where(t => t.Id == taskId).ExecuteDeleteAsync();

            if (deletedCount == 0)
            {
                return CustomNotFound("Task Not Found", []);
            }

            return NoContent();
        }

        // ** Update Task
        [HttpPut("/api/tasks/{taskId}")]
        public async Task<IActionResult> UpdateTask(
            Guid taskId,
            [FromBody] UpdateTaskDto updateTask
        )
        {
            var taskModel = await context
                .Tasks.Include(t => t.Project)
                    .ThenInclude(p => p.Team)
                .FirstOrDefaultAsync(t => t.Id == taskId);

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

            if (updateTask.StudentIds.Count > 0)
            {
                var targetTeamId = taskModel.Project.Team!.Id;

                var validStudentsCount = await context
                    .StudentTeams.Where(st =>
                        st.TeamId == targetTeamId && updateTask.StudentIds.Contains(st.StudentId)
                    )
                    .CountAsync();

                if (updateTask.StudentIds.Count != validStudentsCount)
                {
                    return CustomBadRequest(
                        "All assigned students must be members of the specified project team.",
                        []
                    );
                }
            }
            await context.TaskStudents.Where(ts => ts.TaskId == taskId).ExecuteDeleteAsync();

            if (updateTask.StudentIds.Count > 0)
            {
                var taskStudentsModel = updateTask
                    .StudentIds.Select(id => new TaskStudent { StudentId = id, TaskId = taskId })
                    .ToList();

                context.TaskStudents.AddRange(taskStudentsModel);
            }

            await context.SaveChangesAsync();

            var responseDto = new TaskDto(
                taskModel.Id,
                taskModel.Title,
                taskModel.Description ?? "",
                taskModel.Status,
                taskModel.MilestoneId,
                updateTask
                    .StudentIds.Select(id => new AssignedStudentDto(id, "Assigned Student"))
                    .ToList()
            );

            return Success(responseDto, "Task Updated Successfully");
        }
    }
}
