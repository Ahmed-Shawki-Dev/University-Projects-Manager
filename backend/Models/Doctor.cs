namespace backend.Models;

public class Doctor : BaseEntity
{
    public Guid Id { get; set; }
    public string AcademicRank { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    // ** Relation With Faculties => One To Many
    public Guid FacultyId { get; set; }
    public Faculty Faculty { get; set; } = null!;

    // ** Relation With Projects => Many To Many
    public List<ProjectDoctor> ProjectDoctors { get; set; } = new();
}
