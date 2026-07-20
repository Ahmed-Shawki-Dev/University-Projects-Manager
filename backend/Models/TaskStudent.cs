namespace backend.Models
{
    public class TaskStudent
    {
        public Guid TaskId { get; set; }
        public Task Task { get; set; } = null!;

        public Guid StudentId { get; set; }
        public Student Student { get; set; } = null!;
    }
}
