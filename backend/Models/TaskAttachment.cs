namespace backend.Models
{
    public class TaskAttachment : BaseEntity
    {
        public Guid Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string FileType { get; set; } = string.Empty;

        public Guid TaskId { get; set; }
        public Task Task { get; set; } = null!;

        public Guid? StudentId { get; set; }
        public Student? Student { get; set; }

        public Guid? DoctorId { get; set; }
        public Doctor? Doctor { get; set; }
    }
}
