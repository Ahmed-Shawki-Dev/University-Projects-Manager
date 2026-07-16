using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Mappers;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/milestones")]
    public class MilestoneController(ApplicationDbContext context) : BaseApiController
    {
        // ** Get All Milestones
        [HttpGet(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/milestones"
        )]
        public async Task<IActionResult> GetAllMilestones(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromRoute] string projectSlug
        )
        {
            if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
            {
                return Forbid();
            }

            var milestonesDto = await context
                .Milestones.AsNoTracking()
                .Where(m => m.Project!.Slug == projectSlug)
                .Select(m => m.ToDto())
                .ToListAsync();

            return Success(milestonesDto, "Milestones Retrieved Successfully");
        }

        // ** Get All Milestones With Tasks
        [HttpGet(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/milestones-with-tasks"
        )]
        public async Task<IActionResult> GetAllMilestonesWithTasks(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromRoute] string projectSlug
        )
        {
            if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
            {
                return Forbid();
            }

            var milestonesModels = await context
                .Milestones.Include(m => m.Tasks)
                .AsNoTracking()
                .Where(m => m.Project!.Slug == projectSlug)
                .ToListAsync();

            var milestonesDto = milestonesModels.Select(m => m.ToWithTasksDto()).ToList();

            return Success(milestonesDto, "Milestones with their tasks retrieved successfully");
        }

        // ** Get Milestone By ID
        [HttpGet("{milestoneId:guid}")]
        public async Task<IActionResult> GetMilestoneById([FromRoute] Guid milestoneId)
        {
            var milestone = await context
                .Milestones.AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == milestoneId);

            if (milestone == null)
            {
                return CustomNotFound(
                    "Milestone Not Found or doesn't match the project context",
                    []
                );
            }

            return Success(milestone.ToDto(), "Milestone Retrieved Successfully");
        }

        // ** Create New Milestone
        [HttpPost(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/milestones"
        )]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> CreateMilestone(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromRoute] string projectSlug,
            [FromBody] CreateMilestoneDto milestoneDto
        )
        {
            if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
            {
                return Forbid();
            }

            var doctorIdClaim = User.FindFirstValue("doctorId");
            if (doctorIdClaim == null)
                return Unauthorized();
            var doctorId = Guid.Parse(doctorIdClaim);

            var projectId = await context
                .Projects.Where(p =>
                    p.Slug == projectSlug && p.ProjectDoctors.Any(pd => pd.DoctorId == doctorId)
                )
                .Select(p => (Guid?)p.Id)
                .FirstOrDefaultAsync();

            if (projectId == null)
                return CustomNotFound(
                    "Project Not Found or you are not authorized to manage it",
                    []
                );

            var milestoneModel = milestoneDto.FromCreateToModel();
            milestoneModel.ProjectId = projectId.Value;

            context.Milestones.Add(milestoneModel);
            await context.SaveChangesAsync();

            return CustomCreateAtAction(
                nameof(GetMilestoneById),
                new { milestoneId = milestoneModel.Id },
                milestoneModel.ToDto(),
                "Milestone Created Successfully"
            );
        }
    }
}
