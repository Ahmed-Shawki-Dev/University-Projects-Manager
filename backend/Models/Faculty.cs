namespace backend.Models
{
    public class Faculty : BaseEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;

        public Guid UniversityId { get; set; }
        public University University { get; set; } = null!;
    }
}
