using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Milestone : BaseEntity
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        [Column(TypeName = "decimal(5,2)")]
        public decimal MaxGrade { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime DueDate { get; set; }

        public Guid ProjectId { get; set; }
        public Project? Project { get; set; }

        public List<Task> Tasks { get; set; } = new();
    }
}
