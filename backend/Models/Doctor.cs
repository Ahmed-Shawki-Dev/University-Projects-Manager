namespace backend.Models;

public class Doctor
{
    public Guid Id { get; set; }
    public string AcademicRank { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    // ** Relation With Projects => Many To Many
    public List<ProjectDoctor> ProjectDoctors { get; set; } = new();
}
