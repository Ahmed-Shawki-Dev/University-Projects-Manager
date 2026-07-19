using System.Data.SqlTypes;
using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    public class GradingController(ApplicationDbContext context) : BaseApiController
    {
        // ** Get All Team Members To Grading System Modal
        [Authorize(Roles = "Doctor")]
        [HttpGet(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/milestones/{milestoneId}/grades"
        )]
        public async Task<IActionResult> GetTeamMembersWithStudentGrades(
            string universitySlug,
            string facultySlug,
            string projectSlug,
            Guid milestoneId
        )
        {
            if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
            {
                return Forbid();
            }

            var doctorIdClaim = User.FindFirstValue("doctorId");
            var doctorId = Guid.Parse(doctorIdClaim ?? "");

            var isDoctorRelatedToProject = await context.ProjectDoctors.AnyAsync(pd =>
                pd.DoctorId == doctorId && pd.Project.Slug == projectSlug
            );

            if (!isDoctorRelatedToProject)
            {
                return CustomBadRequest("Doctor Don't Relate To This Project", []);
            }

            var milestoneMaxGrade = await context
                .Milestones.Where(m => m.Id == milestoneId)
                .Select(m => m.MaxGrade)
                .FirstOrDefaultAsync();

            var teamMembersWithGradesDto = await context
                .StudentTeams.Include(st => st.Student.User)
                .Where(st => st.Team!.Project.Slug == projectSlug)
                .Select(s => new StudentMilestoneGradeDto(
                    s.StudentId,
                    s.Student.User.FullName,
                    s.Student.User.Email ?? "",
                    s.Student.StudentGrades.Where(sg => sg.MilestoneId == milestoneId)
                        .Select(sg => (decimal?)sg.Grade)
                        .FirstOrDefault()
                ))
                .ToListAsync();

            return Success(teamMembersWithGradesDto, "Data Retrived Successfully");
        }

        // ** Add Grades To Team Members Milestones
        [Authorize(Roles = "Doctor")]
        [HttpPost(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/milestones/{milestoneId}/bulk-grade"
        )]
        public async Task<IActionResult> SubmitBulkGrades(
            string universitySlug,
            string facultySlug,
            string projectSlug,
            Guid milestoneId,
            [FromBody] List<SubmitStudentGradeDto> dtos
        )
        {
            if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
            {
                return Forbid();
            }

            var doctorIdClaim = User.FindFirstValue("doctorId");
            var doctorId = Guid.Parse(doctorIdClaim ?? "");

            var isDoctorRelatedToProject = await context.ProjectDoctors.AnyAsync(pd =>
                pd.DoctorId == doctorId && pd.Project.Slug == projectSlug
            );
            if (!isDoctorRelatedToProject)
                return CustomBadRequest("Doctor Don't Relate To This Project", []);

            var milestone = await context
                .Milestones.Where(m => m.Id == milestoneId)
                .Select(m => new { m.MaxGrade })
                .FirstOrDefaultAsync();

            if (milestone == null)
                return NotFound("Milestone not found");

            if (dtos.Any(dto => dto.Grade > milestone.MaxGrade))
            {
                return CustomBadRequest(
                    $"Grade cannot exceed the milestone maximum grade ({milestone.MaxGrade})",
                    []
                );
            }

            var uniqueStudentCount = dtos.Select(d => d.StudentId).Distinct().Count();

            if (uniqueStudentCount != dtos.Count)
            {
                return CustomBadRequest("Duplicate student IDs are not allowed in the same request.", []);
            }


            await context
                .StudentGrades.Where(sg => sg.MilestoneId == milestoneId)
                .ExecuteDeleteAsync();

            var newGrades = dtos.Select(dto => new StudentGrade
                {
                    StudentId = dto.StudentId,
                    MilestoneId = milestoneId,
                    Grade = dto.Grade,
                })
                .ToList();

            await context.StudentGrades.AddRangeAsync(newGrades);
            await context.SaveChangesAsync();

            return Success("Bulk grades saved successfully.");
        }
    }
}
