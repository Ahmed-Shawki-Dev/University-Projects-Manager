namespace backend.Models
{
    public class StudentTeam
    {
        public Guid StudentId { get; set; }
        public Guid TeamId { get; set; }

        public Student Student { get; set; } = null!;
        public Team Team { get; set; } = null!;
    }
}
