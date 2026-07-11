namespace backend.Models
{
    public class AcademicContext : BaseEntity
    {
        public Guid Id { get; set; }
        public string AcademicYear { get; set; } = string.Empty;
        public string Semester { get; set; } = string.Empty;
        public bool IsCurrent { get; set; }

        // **One Faculty Have Many Academic Context
        public Guid FacultyId { get; set; }
        public Faculty Faculty { get; set; } = null!;

        // ** One Academic Context Related To Many Projects
        public List<Project> Projects { get; set; } = new();
    }
}
