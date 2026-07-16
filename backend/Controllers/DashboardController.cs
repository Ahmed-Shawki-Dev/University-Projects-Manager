using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("/api/universities/{universitySlug}/faculties/{facultySlug}/dashboard")]
public class DashboardController(ApplicationDbContext context) : BaseApiController
{
    [HttpGet("doctor")]
    [Authorize(Roles = "Doctor")]
    public async Task<object> GetDoctorDashboardDetails(
        [FromRoute] string universitySlug,
        [FromRoute] string facultySlug
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

        // !! Doctor Stats Card Values
        // ** Projects Count Related To The Doctor
        var projectsCount = await context
            .Projects.Where(p => p.ProjectDoctors.Any(pd => pd.DoctorId == doctorId))
            .CountAsync();

        // ** Students Count Related To The Project Which Related To The Doctor
        var studentsCount = await context
            .StudentTeams.Where(st =>
                st.Team.Project.ProjectDoctors.Any(pd => pd.DoctorId == doctorId)
            )
            .Select(st => st.StudentId)
            .Distinct()
            .CountAsync();

        // ** Tasks Count Related To Doctor
        var finishedTasksCount = await context
            .Tasks.Where(t =>
                t.Status == TaskStatusEnum.Done
                && t.Project.ProjectDoctors.Any(pd => pd.DoctorId == doctorId)
            )
            .CountAsync();

        var DoctorStatsCards = new DoctorDashboardStatsCards(
            projectsCount,
            studentsCount,
            finishedTasksCount
        );

        // !! Upcoming Milestones
        var upcomingMilestones = await context
            .Milestones.Where(m =>
                m.Project!.ProjectDoctors.Any(pd => pd.DoctorId == doctorId)
                && m.DueDate >= DateTime.UtcNow
            )
            .OrderBy(m => m.DueDate)
            .Take(5)
            .Select(m => new DoctorDashboardMilestoneDto(m.Id, m.Title, m.Project!.Name, m.DueDate))
            .ToListAsync();

        // !! Alerts
        var alerts = await context
            .Milestones.Where(m =>
                m.Project!.ProjectDoctors.Any(pd => pd.DoctorId == doctorId)
                && m.DueDate < DateTime.UtcNow
                && m.Tasks.Any(t => t.Status != TaskStatusEnum.Done)
            )
            .OrderBy(m => m.DueDate)
            .Select(m => new DoctorDashboardAlertDto(
                m.ProjectId,
                m.Project!.Name,
                "Milestone Overdue",
                $"Milestone '{m.Title}' is behind schedule, and there are pending tasks.",
                m.DueDate
            ))
            .Take(5)
            .ToListAsync();

        // !! The Collection And Response
        var response = new DoctorDashboardResponseDto(DoctorStatsCards, upcomingMilestones, alerts);

        return Success(response, "Doctor dashboard data retrieved successfully");
    }
}
