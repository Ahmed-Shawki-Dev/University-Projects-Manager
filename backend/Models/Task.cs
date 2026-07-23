namespace backend.Models
{
    public enum TaskStatusEnum
    {
        Unknown = 0,
        Todo = 1,
        InProgress = 2,
        Review = 3,
        Done = 4,
    }

    public class Task : BaseEntity
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TaskStatusEnum Status { get; set; } = TaskStatusEnum.Todo;
        public Guid ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        public Guid? MilestoneId { get; set; }
        public Milestone? Milestone { get; set; }

        // Relation Between Student And There Tasks
        public List<TaskStudent> TaskStudents { get; set; } = new();

        // Relation Between Task And There Comments
        public List<TaskComment> TaskComments { get; set; } = new();
    }
}
