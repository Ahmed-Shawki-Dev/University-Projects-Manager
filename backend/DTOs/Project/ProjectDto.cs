using backend.Models;

namespace backend.DTOs.Project
{
    public record ProjectDto(
        Guid Id,
        string Name,
        string Description,
        string Slug,
        ProjectType Type
    );

    public record CreateProjectDto(
        string Name,
        string Description,
        decimal TotalProjectGrade,
        DateTime Deadline,
        ProjectType Type
    );
}
