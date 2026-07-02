using System.ComponentModel.DataAnnotations.Schema;

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

        [Column(TypeName = "decimal(5,2)")]
        public decimal TotalProjectGrade { get; set; }
        public ProjectType Type { get; set; }

        public Guid FacultyId { get; set; }
        public Faculty Faculty { get; set; } = null!;

        public virtual Team? Team { get; set; }

        public List<Task> Tasks { get; set; } = new();
        public List<Milestone> Milestones { get; set; } = new();
    }
}
