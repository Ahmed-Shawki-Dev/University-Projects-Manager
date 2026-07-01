using backend.Data;
using backend.DTOs.Milestone;
using backend.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    public class MilestoneController(ApplicationDbContext context) : BaseApiController
    {
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
                .Milestones.Where(m =>
                    m.Project!.Faculty.University.Slug == universitySlug
                    && m.Project.Faculty.Slug == facultySlug
                    && m.Project.Slug == projectSlug
                )
                .Select(m => m.ToDto())
                .ToListAsync();

            return Success(milestonesDto, "Milestones Retrieved Successfully");
        }

        [HttpGet(
            "/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/milestones/{milestoneId}"
        )]
        public async Task<IActionResult> GetMilestoneById(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromRoute] string projectSlug,
            [FromRoute] Guid milestoneId
        )
        {
            var milestone = await context.Milestones.FirstOrDefaultAsync(m =>
                m.Id == milestoneId
                && m.Project!.Slug == projectSlug
                && m.Project.Faculty.Slug == facultySlug
                && m.Project.Faculty.University.Slug == universitySlug
            );

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
                new
                {
                    universitySlug,
                    facultySlug,
                    projectSlug,
                    milestoneId = milestoneModel.Id,
                },
                milestoneModel.ToDto(),
                "Milestone Created Successfully"
            );
        }
    }
}
