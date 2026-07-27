namespace backend.Models
{
    public class TaskAttachment : BaseEntity
    {
        public Guid Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string FileType { get; set; } = string.Empty;
        public Guid UploadedBy { get; set; }

        public Guid TaskId { get; set; }
        public Task Task { get; set; } = null!;
    }
}
