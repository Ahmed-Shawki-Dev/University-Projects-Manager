namespace backend.Models
{
    public class Team : BaseEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public Guid ProjectId { get; set; }
        public virtual Project Project { get; set; } = null!;

        // * StudentTeam
        public List<StudentTeam> StudentTeams { get; set; } = new();
    }
}
