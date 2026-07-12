using backend.Models;

namespace backend.DTOs;

    public record ProjectDto(
        Guid Id,
        string Name,
        string Description,
        int MaxStudents,
        string Slug,
        ProjectType Type
    );

    public record CreateProjectDto(
        string Name,
        string Description,
        decimal TotalProjectGrade,
        DateTime Deadline,
        ProjectType Type,
        int MaxStudents
    );

