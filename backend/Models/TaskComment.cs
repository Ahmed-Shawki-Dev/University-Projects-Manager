namespace backend.Models;

public class TaskComment : BaseEntity
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;

    // ** Task-Comments Relation
    public Guid TaskId { get; set; }
    public Task Task { get; set; } = null!;

    // ** Comments-Student Relation
    public Guid? StudentId { get; set; }
    public Student? Student { get; set; }

    // ** Doctor-Comments Relation
    public Guid? DoctorId { get; set; }
    public Doctor? Doctor { get; set; }
}
