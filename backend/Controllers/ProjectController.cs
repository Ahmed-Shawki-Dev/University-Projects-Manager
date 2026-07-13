using backend.Data;
using backend.DTOs;
using backend.Filters;
using backend.Mappers;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ServiceFilter(typeof(CheckFacultyContextFilter))]
    public class ProjectController(ApplicationDbContext context) : BaseApiController
    {
        // ** Get All Projects With Team Details In Explore Page
        [HttpGet("/api/universities/{universitySlug}/faculties/{facultySlug}/projects")]
        public async Task<IActionResult> GetAllProjects(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromQuery] ProjectType? projectType
        )
        {
            Guid? currentStudentId = null;
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim != null)
            {
                currentStudentId = await context
                    .Students.Where(s => s.UserId == Guid.Parse(userIdClaim.Value))
                    .Select(s => s.Id)
                    .FirstOrDefaultAsync();
            }

            var query = context
                .Projects.AsNoTracking()
                .Where(p =>
                    p.Faculty.University.Slug == universitySlug && p.Faculty.Slug == facultySlug
                );

            if (projectType != null)
            {
                query = query.Where(p => p.Type == projectType);
            }

            var projects = await query
                .Select(p => new ProjectExploreDto(
                    p.Id,
                    p.Name,
                    p.Description ?? string.Empty,
                    p.Team != null ? p.Team.MaxStudents : 0,
                    p.Team != null ? p.Team.StudentTeams.Count : 0,
                    p.Slug,
                    p.Type,
                    currentStudentId != null
                        && p.Team != null
                        && p.Team.StudentTeams.Any(st => st.StudentId == currentStudentId.Value)
                ))
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
            string generatedSlug = SlugHelper.GenerateSlug(projectDto.Name);

            var facultyId = await context
                .Faculties.Where(f => f.Slug == facultySlug && f.University.Slug == universitySlug)
                .Select(f => (Guid?)f.Id)
                .FirstOrDefaultAsync();

            if (facultyId == null)
                return CustomBadRequest("The specified Faculty does not exist.", []);

            var isProjectExist = await context.Projects.AnyAsync(p =>
                p.Slug == generatedSlug && p.FacultyId == facultyId.Value
            );
            if (isProjectExist)
                return CustomBadRequest("Project Is Already Exist", []);

            var projectModel = projectDto.ToModel();
            projectModel.FacultyId = facultyId.Value;
            projectModel.AcademicContextId = null;
            projectModel.Slug = generatedSlug;
            projectModel.Faculty = null!;

            context.Projects.Add(projectModel);

            Team teamModel = new Team
            {
                Id = Guid.NewGuid(),
                Name = $"Team - {projectModel.Name}",
                Project = projectModel,
                MaxStudents = projectDto.MaxStudents,
                LeaderId = null,
                InviteCode = Guid.NewGuid().ToString().Substring(0, 6).ToUpper(),
            };

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
                "Project and its Team Created Successfully"
            );
        }

        // ** Join To The Project Api
        [HttpPost(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/join"
        )]
        public async Task<IActionResult> StudentJoinToProject(
            string facultySlug,
            string universitySlug,
            string projectSlug
        )
        {
            var userIdClaim = User.FindFirst("userId");
            Console.WriteLine(userIdClaim);
            if (userIdClaim == null)
                return Unauthorized("User context is missing.");

            var student = await context.Students.FirstOrDefaultAsync(s =>
                s.UserId == Guid.Parse(userIdClaim.Value)
            );
            if (student == null)
                return CustomBadRequest("The Student Not Exist!", []);

            var team = await context
                .Teams.Include(t => t.StudentTeams)
                .FirstOrDefaultAsync(t => t.Project.Slug == projectSlug);

            if (team == null)
                return CustomBadRequest("The Team Not Exist!", []);

            var isAlreadyMember = team.StudentTeams.Any(st => st.StudentId == student.Id);
            if (isAlreadyMember)
                return CustomBadRequest("You are already joined to the team!", []);

            if (team.StudentTeams.Count >= team.MaxStudents)
                return CustomBadRequest("The team is full.", []);

            if (team.LeaderId == null || team.StudentTeams.Count == 0)
            {
                team.LeaderId = student.Id;
            }

            var newMemberEntry = new StudentTeam { StudentId = student.Id, TeamId = team.Id };

            context.StudentTeams.Add(newMemberEntry);

            await context.SaveChangesAsync();

            return Success("Joined to team successfully");
        }
    }
}
