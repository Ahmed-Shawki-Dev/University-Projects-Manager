using backend.Data;
using backend.DTOs.Project;
using backend.Filters;
using backend.Mappers;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ServiceFilter(typeof(CheckFacultyContextFilter))]
    public class ProjectController(ApplicationDbContext context) : BaseApiController
    {
        // **Get All Projects
        [HttpGet("/api/universities/{universitySlug}/faculties/{facultySlug}/projects")]
        public async Task<IActionResult> GetAllProjects(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug
        )
        {
            var projects = await context
                .Projects.AsNoTracking()
                .Where(p =>
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

        // ** Create a project
        [HttpPost("/api/universities/{universitySlug}/faculties/{facultySlug}/projects")]
        public async Task<IActionResult> CreateProject(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromBody] CreateProjectDto projectDto
        )
        {
            var currentUserId = User.FindFirst("userId")?.Value;
            var currentRole = User
                .Claims.FirstOrDefault(c => c.Type.ToLower() == "userrole")
                ?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized();
            }

            string generatedSlug = SlugHelper.GenerateSlug(projectDto.Name);

            var isProjectExist = await context.Projects.AnyAsync(p =>
                p.Faculty.University.Slug == universitySlug
                && p.Faculty.Slug == facultySlug
                && p.Slug == generatedSlug
            );

            if (isProjectExist)
            {
                return CustomBadRequest("Project Is Already Exist", []);
            }

            var facultyId = await context
                .Faculties.Where(f => f.Slug == facultySlug && f.University.Slug == universitySlug)
                .Select(f => (Guid?)f.Id)
                .FirstOrDefaultAsync();

            if (facultyId == null)
            {
                return CustomBadRequest("The specified Faculty or University does not exist.", []);
            }

            var projectModel = projectDto.ToModel();

            projectModel.FacultyId = facultyId.Value;
            projectModel.Slug = generatedSlug;

            context.Projects.Add(projectModel);

            Team teamModel = new Team();
            teamModel.Name = projectModel.Name;
            teamModel.Project = projectModel;

            Console.WriteLine($"[DEBUG] currentUserId from Token: '{currentUserId}'");
            Console.WriteLine($"[DEBUG] currentRole from Token: '{currentRole}'");
            Console.WriteLine(
                $"[DEBUG] checking condition: is '{currentRole}' equals to 'Student'?"
            );

            if (string.Equals(currentRole, "Student", StringComparison.OrdinalIgnoreCase))
            {
                var student = await context
                    .Students.AsNoTracking()
                    .FirstOrDefaultAsync(s => s.UserId == Guid.Parse(currentUserId));
                teamModel.LeaderId = student!.Id;
                var studentTeamModel = new StudentTeam { StudentId = student.Id, Team = teamModel };
                context.StudentTeams.Add(studentTeamModel);
            }

            context.Teams.Add(teamModel);

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
