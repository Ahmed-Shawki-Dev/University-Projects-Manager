namespace backend.Models;

public class Admin : BaseEntity
{
    public Guid Id { get; set; }

    // ** 1-1 With AppUser
    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    // ** 1-M With Faculty
    public Guid FacultyId { get; set; }
    public Faculty Faculty { get; set; } = null!;
}
