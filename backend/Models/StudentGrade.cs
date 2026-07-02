using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class StudentGrade
    {
        public Guid StudentId { get; set; }
        public Guid MilestoneId { get; set; }

        public Student Student { get; set; } = null!;
        public Milestone Milestone { get; set; } = null!;

        [Column(TypeName = "decimal(5,2)")]
        public decimal Grade { get; set; }
    }
}
