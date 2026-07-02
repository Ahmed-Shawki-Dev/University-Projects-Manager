namespace backend.Models
{
    public class Faculty : BaseEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;

        public Guid UniversityId { get; set; }
        public University University { get; set; } = null!;

        public List<Project> Projects { get; set; } = new List<Project>();
        public List<Student> Students { get; set; } = new List<Student>();
    }
}
