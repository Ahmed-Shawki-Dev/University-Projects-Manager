using backend.Models;

namespace backend.DTOs;


public record ProjectDto(
        Guid Id,
        string Name,
        string? Description,
        string Slug,
        ProjectType Type
    );

public record ProjectExploreDto(
    Guid Id,
    string Name,
    string Description,
    int MaxStudents,
    int CurrentStudentCount,
    string Slug,
    ProjectType Type,
    bool IsCurrentStudentJoined
) {
    public bool IsFull => CurrentStudentCount >= MaxStudents;
    }

    public record CreateProjectDto(
        string Name,
        string Description,
        decimal TotalProjectGrade,
        DateTime Deadline,
        ProjectType Type,
        int MaxStudents
    );
