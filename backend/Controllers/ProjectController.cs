using backend.Data;
using backend.DTOs.Project;
using backend.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    public class ProjectController(ApplicationDbContext context) : BaseApiController
    {
        [HttpGet("/api/universities/{universitySlug}/faculties/{facultySlug}/projects")]
        public async Task<IActionResult> GetAllProjects(
            [FromRoute] string facultySlug,
            [FromRoute] string universitySlug
        )
        {
            var projects = await context
                .Projects.Where(p => p.Faculty.Slug == facultySlug)
                .Select(p => p.ToDto())
                .ToListAsync();

            return Success(projects, "Projects retrieved successfully");
        }
    }
}
