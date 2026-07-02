namespace backend.Models
{
    public class Student : BaseEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int StudentCode { get; set; }
        public string Email { get; set; } = string.Empty;

        public Guid FacultyId { get; set; }
        public Faculty? Faculty { get; set; }

        // StudentTeam
        // StudentGrade
    }
}
