namespace backend.DTOs.Task
{
    public record TaskDto(Guid Id, string Title, string Description, string Status);
}
