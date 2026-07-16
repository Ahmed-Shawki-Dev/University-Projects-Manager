using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Mappers;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
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

        // ** Get Project
        [HttpGet(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}"
        )]
        public async Task<IActionResult> GetProjectBySlug(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromRoute] string projectSlug
        )
        {
            if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
            {
                return Forbid();
            }

            var projectDto = await context
                .Projects.Where(p => p.Slug == projectSlug)
                .Select(p => p.ToDto())
                .FirstOrDefaultAsync();

            if (projectDto == null)
            {
                return CustomNotFound("Project Not Found", []);
            }

            return Success(projectDto, "Project Retrieved Successfully");
        }

        // ** Get Sidebar Project (My Project)
        [HttpGet("/api/universities/{universitySlug}/faculties/{facultySlug}/projects/my-projects")]
        public async Task<IActionResult> GetStudentJoinedProjects(
            string universitySlug,
            string facultySlug
        )
        {
            var userIdClaim = User.FindFirst("userId");
            var userRole = User.FindFirst("userRole");

            if (userIdClaim == null || userRole == null)
            {
                return Unauthorized();
            }
            if (userRole.Value == "Student")
            {
                var studentIdClaim = User.FindFirstValue("studentId");

                if (string.IsNullOrEmpty(studentIdClaim))
                {
                    return Unauthorized("Student ID is missing in your session.");
                }

                var studentId = Guid.Parse(studentIdClaim);

                if (studentId == Guid.Empty)
                    return CustomBadRequest("The Student Not Exist!", []);

                var studentProject = await context
                    .Projects.AsNoTracking()
                    .Where(p =>
                        p.Team != null && p.Team.StudentTeams.Any(st => st.StudentId == studentId)
                    )
                    .Select(p => p.ToDto())
                    .ToListAsync();

                return Success(studentProject, "Joined projects retrieved successfully");
            }

            if (userRole.Value == "Doctor")
            {
                var doctorIdClaim = User.FindFirstValue("doctorId");

                if (string.IsNullOrEmpty(doctorIdClaim))
                {
                    return Unauthorized("Doctor ID is missing in your session.");
                }

                var doctorId = Guid.Parse(doctorIdClaim);

                if (doctorId == Guid.Empty)
                    return CustomBadRequest("The Doctor Not Exist!", []);

                var doctorProject = await context
                    .Projects.AsNoTracking()
                    .Where(p =>
                        p.Faculty.University.Slug == universitySlug && p.Faculty.Slug == facultySlug
                    )
                    .Where(p => p.ProjectDoctors.Any(pd => pd.DoctorId == doctorId))
                    .Select(p => p.ToDto())
                    .ToListAsync();

                return Success(doctorProject, "Joined projects retrieved successfully");
            }
            return Forbid();
        }

        // ** Create a project
        [Authorize(Roles = "Doctor")]
        [HttpPost("/api/universities/{universitySlug}/faculties/{facultySlug}/projects")]
        public async Task<IActionResult> CreateProject(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromBody] CreateProjectDto projectDto
        )
        {
            if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
            {
                return Forbid();
            }

            string generatedSlug = SlugHelper.GenerateSlug(projectDto.Name);

            var doctorIdString = User.FindFirstValue("doctorId");
            if (string.IsNullOrEmpty(doctorIdString))
                return Unauthorized("Doctor ID not found in token.");

            Guid doctorId = Guid.Parse(doctorIdString);

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
            projectModel.Slug = generatedSlug;

            projectModel.ProjectDoctors.Add(
                new ProjectDoctor { DoctorId = doctorId, Project = projectModel }
            );

            context.Projects.Add(projectModel);
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
                "Project, Team, and Doctor Relationship Created Successfully!"
            );
        }

        // ** Join To The Project Api
        [HttpPost(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/join"
        )]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> StudentJoinToProject(
            string facultySlug,
            string universitySlug,
            string projectSlug
        )
        {
            if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
            {
                return Forbid();
            }

            var studentIdClaim = User.FindFirstValue("studentId");
            if (studentIdClaim == null)
                return Unauthorized("User context is missing.");

            Guid studentId = Guid.Parse(studentIdClaim);

            var team = await context
                .Teams.Include(t => t.StudentTeams)
                .FirstOrDefaultAsync(t =>
                    t.Project.Slug == projectSlug && t.Project.Faculty.Slug == facultySlug
                );

            if (team == null)
                return CustomBadRequest("The Team Not Exist!", []);

            var isAlreadyMember = team.StudentTeams.Any(st => st.StudentId == studentId);
            if (isAlreadyMember)
                return CustomBadRequest("You are already joined to the team!", []);

            if (team.StudentTeams.Count >= team.MaxStudents)
                return CustomBadRequest("The team is full.", []);

            if (team.LeaderId == null || team.StudentTeams.Count == 0)
            {
                team.LeaderId = studentId;
            }

            var newMemberEntry = new StudentTeam { StudentId = studentId, TeamId = team.Id };

            context.StudentTeams.Add(newMemberEntry);

            await context.SaveChangesAsync();

            return Success("Joined to team successfully");
        }
    }
}
