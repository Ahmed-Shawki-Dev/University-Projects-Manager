namespace backend.DTOs;

public record FacultyDto(
    Guid Id,
    string Name,
    string Slug,
    Guid? UniversityId,
    UniversityDto? University = null
);

public record CreateFacultyDto(string Name, string Slug);

public record UpdateFacultyDto(string Name);
