namespace backend.Models
{
    public class ProjectActivity : BaseEntity
    {
        public Guid Id { get; set; }
        public Guid? ProjectId { get; set; }
        public Project? Project { get; set; }
        public string Message { get; set; } = default!;
    }
}
