namespace backend.DTOs.Project
{
    public record ProjectDto(Guid Id, string Name, string Description, string Slug, string Type);
}
