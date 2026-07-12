using backend.DTOs;
using backend.Models;

namespace backend.Mappers;

public static class ProjectMapper
{
    public static ProjectDto ToDto(this Project project)
    {
        return new ProjectDto(
            project.Id,
            project.Name,
            project.Description!,
            project.Team != null ? project.Team.MaxStudents : 0,
            project.Slug,
            project.Type
        );
    }

    public static Project ToModel(this CreateProjectDto projectDto)
    {
        return new Project
        {
            Name = projectDto.Name,
            Description = projectDto.Description,
            TotalProjectGrade = projectDto.TotalProjectGrade,
            Deadline = projectDto.Deadline.ToUniversalTime(),
            Type = projectDto.Type,
        };
    }
}
