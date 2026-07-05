namespace backend.Models
{
    public class Student : BaseEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string StudentCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public Guid FacultyId { get; set; }
        public Faculty? Faculty { get; set; }

        // StudentTeam
        public List<StudentTeam> StudentTeams { get; set; } = new();

        // StudentGrade
        public List<StudentGrade> StudentGrades { get; set; } = new();

        // Auth System
        public Guid UserId { get; set; }
        public AppUser User { get; set; } = null!;
    }
}
