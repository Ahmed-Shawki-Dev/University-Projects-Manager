namespace backend.Models
{
    public class Faculty : BaseEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;

        // ** Relation With University => One University Have Many Faculties
        public Guid UniversityId { get; set; }
        public University University { get; set; } = null!;

        // ** Relation With Projects => One Faculty Have Many Projects
        public List<Project> Projects { get; set; } = new();

        // ** Relation With Students => One Faculty Have Many Students
        public List<Student> Students { get; set; } = new();

        // ** Relation With Students => One Faculty Have Many AcademicContexts
        public List<AcademicContext> AcademicContexts { get; set; } = new();

        // ** Relation With Admin => One Faculty Have Many Admins
        public List<Admin> Admins { get; set; } = new();

        // ** Relation With Projects => Many To Many
        public List<Doctor> Doctors { get; set; } = new();
    }
}
