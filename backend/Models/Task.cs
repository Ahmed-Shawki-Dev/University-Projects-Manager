namespace backend.Models
{
    public enum TaskStatusEnum
    {
        Todo = 1,
        InProgress = 2,
        Review = 3,
        Done = 4,
    }

    public class Task : BaseEntity
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public TaskStatusEnum Status { get; set; }
        public Guid ProjectId { get; set; }
        public Project Project { get; set; } = null!;
    }
}
