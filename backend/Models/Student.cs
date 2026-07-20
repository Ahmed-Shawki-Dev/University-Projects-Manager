namespace backend.Models
{
    public class Student : BaseEntity
    {
        public Guid Id { get; set; }
        public string StudentCode { get; set; } = string.Empty;

        public Guid FacultyId { get; set; }
        public Faculty? Faculty { get; set; }

        // StudentTeam
        public List<StudentTeam> StudentTeams { get; set; } = new();

        // StudentGrade
        public List<StudentGrade> StudentGrades { get; set; } = new();

        // Auth System
        public Guid UserId { get; set; }
        public AppUser User { get; set; } = null!;

        // Relation Between Student And There Tasks
        public List<TaskStudent> TaskStudents { get; set; } = new();
    }
}
