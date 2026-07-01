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
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug
        )
        {
            var projects = await context
                .Projects.Where(p =>
                    p.Faculty.University.Slug == universitySlug && p.Faculty.Slug == facultySlug
                )
                .Select(p => p.ToDto())
                .ToListAsync();

            return Success(projects, "Projects retrieved successfully");
        }

        [HttpGet(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}"
        )]
        public async Task<IActionResult> GetProjectBySlug(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromRoute] string projectSlug
        )
        {
            var projectDto = await context
                .Projects.Where(p =>
                    p.Faculty.University.Slug == universitySlug
                    && p.Faculty.Slug == facultySlug
                    && p.Slug == projectSlug
                )
                .Select(p => p.ToDto())
                .FirstOrDefaultAsync();

            if (projectDto == null)
            {
                return CustomNotFound("Project Not Found", []);
            }

            return Success(projectDto, "Project Retrieved Successfully");
        }

        [HttpPost("/api/universities/{universitySlug}/faculties/{facultySlug}/projects")]
        public async Task<IActionResult> CreateProject(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromBody] CreateProjectDto projectDto
        )
        {
            var isProjectExist = await context
                .Projects.AsQueryable()
                .AnyAsync(p =>
                    p.Faculty.University.Slug == universitySlug
                    && p.Faculty.Slug == facultySlug
                    && p.Slug == projectDto.Slug
                );

            if (isProjectExist)
            {
                return CustomBadRequest("Project Is Already Exist", []);
            }

            var facultyId = await context
                .Faculties.Where(f => f.Slug == facultySlug && f.University.Slug == universitySlug)
                .Select(f => (Guid?)f.Id)
                .FirstOrDefaultAsync();

            var projectModel = projectDto.ToModel();
            projectModel.FacultyId = facultyId!.Value;

            context.Add(projectModel);
            await context.SaveChangesAsync();

            return CustomCreateAtAction(
                nameof(GetProjectBySlug),
                new
                {
                    universitySlug,
                    facultySlug,
                    projectSlug = projectModel.Slug,
                },
                projectModel.ToDto(),
                "Project Created Successfully"
            );
        }
    }
}
