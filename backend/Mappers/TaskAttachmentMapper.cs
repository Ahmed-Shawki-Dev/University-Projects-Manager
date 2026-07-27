using backend.DTOs;
using backend.Models;

namespace backend.Mappers
{
    public static class TaskAttachmentMapper
    {
        public static TaskAttachmentDto ToDto(
            this TaskAttachment taskAttachment,
            string? currentUploaderName = null
        )
        {
            var uploaderName =
                currentUploaderName
                ?? taskAttachment.Student?.User?.FullName
                ?? taskAttachment.Doctor?.User?.FullName
                ?? "Unknown";

            return new TaskAttachmentDto(
                taskAttachment.Id,
                taskAttachment.FileName,
                taskAttachment.FileType,
                taskAttachment.FileSize,
                uploaderName
            );
        }
    }
}
