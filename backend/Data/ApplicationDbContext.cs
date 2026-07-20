using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<University> Universities { get; set; }
    public DbSet<Faculty> Faculties { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Milestone> Milestones { get; set; }
    public DbSet<backend.Models.Task> Tasks { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<StudentTeam> StudentTeams { get; set; }
    public DbSet<StudentGrade> StudentGrades { get; set; }
    public DbSet<AcademicContext> AcademicContexts { get; set; }
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<ProjectDoctor> ProjectDoctors { get; set; }
    public DbSet<TaskStudent> TaskStudents { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        //* Unique Slug
        modelBuilder.Entity<University>().HasIndex(u => u.Slug).IsUnique();
        modelBuilder.Entity<Student>().HasIndex(s => new { s.StudentCode, s.FacultyId }).IsUnique();
        modelBuilder.Entity<Faculty>().HasIndex(f => new { f.UniversityId, f.Slug }).IsUnique();
        modelBuilder.Entity<Project>().HasIndex(p => new { p.FacultyId, p.Slug }).IsUnique();

        modelBuilder
            .Entity<Milestone>()
            .HasOne(m => m.Project)
            .WithMany(p => p.Milestones)
            .HasForeignKey(m => m.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder
            .Entity<backend.Models.Task>()
            .HasOne(t => t.Milestone)
            .WithMany(m => m.Tasks)
            .HasForeignKey(t => t.MilestoneId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder
            .Entity<Team>()
            .HasOne(t => t.Project)
            .WithOne(p => p.Team)
            .HasForeignKey<Team>(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder
            .Entity<StudentTeam>()
            .HasOne(st => st.Team)
            .WithMany(t => t.StudentTeams)
            .HasForeignKey(st => st.TeamId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder
            .Entity<StudentTeam>()
            .HasOne(st => st.Student)
            .WithMany(s => s.StudentTeams)
            .HasForeignKey(st => st.StudentId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder
            .Entity<StudentGrade>()
            .HasOne(sg => sg.Milestone)
            .WithMany(m => m.StudentGrades)
            .HasForeignKey(sg => sg.MilestoneId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder
            .Entity<StudentGrade>()
            .HasOne(sg => sg.Student)
            .WithMany(s => s.StudentGrades)
            .HasForeignKey(sg => sg.StudentId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<StudentTeam>().HasKey(st => new { st.StudentId, st.TeamId });

        modelBuilder.Entity<StudentGrade>().HasKey(sg => new { sg.StudentId, sg.MilestoneId });

        modelBuilder
            .Entity<AppUser>()
            .HasOne(u => u.Student)
            .WithOne(s => s.User)
            .HasForeignKey<Student>(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder
            .Entity<AppUser>()
            .HasOne(u => u.Doctor)
            .WithOne(s => s.User)
            .HasForeignKey<Doctor>(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ** Relation Many To Many: Doctor-Projects
        modelBuilder.Entity<ProjectDoctor>().HasKey(pd => new { pd.ProjectId, pd.DoctorId });

        modelBuilder
            .Entity<ProjectDoctor>()
            .HasOne(pd => pd.Project)
            .WithMany(p => p.ProjectDoctors)
            .HasForeignKey(pd => pd.ProjectId);

        modelBuilder
            .Entity<ProjectDoctor>()
            .HasOne(pd => pd.Doctor)
            .WithMany(d => d.ProjectDoctors)
            .HasForeignKey(pd => pd.DoctorId);

        // ** Relation Many-To-Many: Task-Students
        modelBuilder.Entity<TaskStudent>().HasKey(ts => new { ts.TaskId, ts.StudentId });

        modelBuilder
            .Entity<TaskStudent>()
            .HasOne(ts => ts.Task)
            .WithMany(t => t.TaskStudents)
            .HasForeignKey(ts => ts.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder
            .Entity<TaskStudent>()
            .HasOne(ts => ts.Student)
            .WithMany(t => t.TaskStudents)
            .HasForeignKey(ts => ts.StudentId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries<BaseEntity>()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            entry.Entity.UpdatedAt = DateTime.UtcNow;
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
            }
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
