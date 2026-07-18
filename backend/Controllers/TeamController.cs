using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/team")]
public class TeamController(ApplicationDbContext context) : BaseApiController
{
    [HttpGet]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetTeamMembers(
        [FromRoute] string universitySlug,
        [FromRoute] string facultySlug,
        [FromRoute] string projectSlug
    )
    {
        if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
        {
            return Forbid();
        }

        var currentUserId = User.FindFirstValue("studentId");
        var studentId = Guid.Parse(currentUserId ?? "");
        var members = await context
            .StudentTeams.Where(st =>
                st.Team!.Project.Slug == projectSlug && st.Team.Project.Faculty!.Slug == facultySlug
            )
            .Select(st => new TeamMemberDto(
                st.Student.User.FullName,
                st.Student.User.Email!,
                st.StudentId == st.Team.LeaderId,
                st.StudentId == studentId
            ))
            .ToListAsync();

        return Success(members, "Team members retrieved successfully");
    }
}
