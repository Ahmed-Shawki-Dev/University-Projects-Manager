using backend.Data;
using backend.DTOs.Milestone;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/milestones")]
    public class MilestoneController(ApplicationDbContext context) : BaseApiController
    {
        // Get All Milestones
        [HttpGet(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/milestones"
        )]
        public async Task<IActionResult> GetAllMilestones(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromRoute] string projectSlug
        )
        {
            var milestonesDto = await context
                .Milestones.AsNoTracking()
                .Where(m =>
                    m.Project!.Faculty.University.Slug == universitySlug
                    && m.Project.Faculty.Slug == facultySlug
                    && m.Project.Slug == projectSlug
                )
                .Select(m => m.ToDto())
                .ToListAsync();

            return Success(milestonesDto, "Milestones Retrieved Successfully");
        }

        // Get Milestone By ID
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

        [HttpPost(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/milestones"
        )]
        public async Task<IActionResult> CreateMilestone(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromRoute] string projectSlug,
            [FromBody] CreateMilestoneDto milestoneDto
        )
        {
            var projectId = await context
                .Projects.Where(p =>
                    p.Slug == projectSlug
                    && p.Faculty.Slug == facultySlug
                    && p.Faculty.University.Slug == universitySlug
                )
                .Select(p => (Guid?)p.Id)
                .FirstOrDefaultAsync();

            if (projectId == null)
                return CustomNotFound("Project Not Found", []);

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
