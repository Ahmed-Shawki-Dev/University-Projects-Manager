namespace backend.DTOs.Project
{
    public class ProjectDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public DateTime? Deadline { get; set; }

        public string ProjectType { get; set; } = string.Empty;

        public bool IsGroupProject { get; set; } = false;

        public Guid FacultyId { get; set; }
    }
}
