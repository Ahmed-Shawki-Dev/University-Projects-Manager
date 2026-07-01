using backend.DTOs.Project;
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
            Slug = projectDto.Slug,
            Type = projectDto.Type,
        };
    }
}
