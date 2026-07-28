using backend.Data;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("api/activities")]
public class ActivitiesController(ApplicationDbContext context) : BaseApiController
{
    [HttpGet("{projectSlug}")]
    public async Task<IActionResult> GetAllProjectActivities(string projectSlug)
    {
        var projectId = await context
            .Projects.AsNoTracking()
            .Where(p => p.Slug == projectSlug)
            .Select(p => (Guid?)p.Id)
            .FirstOrDefaultAsync();

        if (projectId == null)
        {
            return CustomNotFound("Project Not Exist", []);
        }

        var activitiesDto = await context
            .ProjectActivities.AsNoTracking()
            .Where(pa => pa.ProjectId == projectId)
            .OrderByDescending(pa => pa.CreatedAt)
            .Take(30)
            .Select(a => new ProjectActivitiesDto(a.Id, a.Message, a.CreatedAt))
            .ToListAsync();

        return Success(activitiesDto, "Project Activities Retrieved Successfully");
    }
}
