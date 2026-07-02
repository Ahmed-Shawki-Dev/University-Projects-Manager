namespace backend.Models
{
    public enum ProjectType
    {
        Unknown = 0,
        CourseProject = 1,
        UniversityProject = 2,
        GraduationProject = 3,
    }

    public class Project : BaseEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Slug { get; set; } = string.Empty;
        public DateTime? Deadline { get; set; }
        public decimal TotalProjectGrade { get; set; }
        public ProjectType Type { get; set; }
        public bool IsGroupProject { get; set; } = false;

        public Guid FacultyId { get; set; }
        public Faculty Faculty { get; set; } = null!;

        public List<Task> Tasks { get; set; } = new();
        public List<Milestone> Milestones { get; set; } = new();
    }
}
