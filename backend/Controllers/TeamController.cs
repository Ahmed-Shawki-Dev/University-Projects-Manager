using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("/api/universities/{universitySlug}/faculties/{facultySlug}/projects/{projectSlug}/team")]
public class TeamController(ApplicationDbContext context) : BaseApiController
{
    // ** Show Team Students Members (Accessible by Students AND Doctors)
    [HttpGet]
    [Authorize(Roles = "Student,Doctor")]
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

        var studentIdClaim = User.FindFirstValue("studentId");
        Guid? currentStudentId = Guid.TryParse(studentIdClaim, out var parsedGuid)
            ? parsedGuid
            : null;

        var members = await context
            .StudentTeams.Where(st =>
                st.Team!.Project.Slug == projectSlug && st.Team.Project.Faculty!.Slug == facultySlug
            )
            .Select(st => new TeamMemberDto(
                st.StudentId,
                st.Student.User.FullName,
                st.Student.User.Email!,
                st.StudentId == st.Team.LeaderId,
                currentStudentId.HasValue && st.StudentId == currentStudentId.Value
            ))
            .ToListAsync();

        return Success(members, "Team members retrieved successfully");
    }

    // ** Leave Team (Students Only)
    [HttpPost("leave")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> LeaveTeam(
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
        if (string.IsNullOrEmpty(currentUserId) || !Guid.TryParse(currentUserId, out var studentId))
        {
            return CustomBadRequest("Invalid student identity", []);
        }

        var teamMember = await context
            .StudentTeams.Include(st => st.Team)
            .FirstOrDefaultAsync(st =>
                st.StudentId == studentId
                && st.Team.Project.Slug == projectSlug
                && st.Team.Project.Faculty.Slug == facultySlug
            );

        if (teamMember == null)
        {
            return CustomBadRequest("The student is not part of the team", []);
        }

        if (teamMember.Team.LeaderId == studentId)
        {
            var nextLeader = await context.StudentTeams.FirstOrDefaultAsync(st =>
                st.TeamId == teamMember.TeamId && st.StudentId != studentId
            );

            teamMember.Team.LeaderId = nextLeader?.StudentId;
        }

        context.StudentTeams.Remove(teamMember);
        await context.SaveChangesAsync();

        return Success("The team left successfully");
    }
}
