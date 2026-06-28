using backend.Data;
using backend.Mappers;
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
            var projectExists = await context.Projects.AnyAsync(p =>
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
                .Tasks.Where(t => t.Project.Slug == projectSlug)
                .Select(t => t.ToDto())
                .ToListAsync();

            if (tasks.Count == 0)
            {
                return Success(tasks, "No tasks assigned to this project yet.");
            }

            return Success(tasks, "Tasks Retrieved Successfully");
        }
    }
}
