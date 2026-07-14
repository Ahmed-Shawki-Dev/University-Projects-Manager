namespace backend.Models;

public class ProjectDoctor
{
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public Guid DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;
}
