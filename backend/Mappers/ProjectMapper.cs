using backend.DTOs;
using backend.Models;

namespace backend.Mappers;

public static class ProjectMapper
{
    public static ProjectDto ToDto(this Project project, Guid? currentStudentId = null)
    {
        return new ProjectDto(
            project.Id,
            project.Name,
            project.Description,
            project.Slug,
            project.Type
        );
    }

    public static Project ToModel(this CreateProjectDto projectDto)
    {
        var project = new Project
        {
            Name = projectDto.Name,
            Description = projectDto.Description,
            TotalProjectGrade = projectDto.TotalProjectGrade,
            Deadline = projectDto.Deadline.ToUniversalTime(),
            Type = projectDto.Type,
        };

        project.Team = new Team
        {
            Id = Guid.NewGuid(),
            Name = $"Team - {projectDto.Name}",
            Description = $"Team container for {projectDto.Name}",
            MaxStudents = projectDto.MaxStudents,
            LeaderId = null,
            InviteCode = string.Empty,
        };

        return project;
    }
}
