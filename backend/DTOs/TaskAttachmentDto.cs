using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record UploadTaskAttachmentDto([Required] IFormFile File);

public record UploadTaskAttachmentsDto(List<IFormFile> Files);

public record TaskAttachmentDto(
    Guid Id,
    string FileName,
    string FileType,
    long FileSize,
    string FileUrl,
    string UploaderName
);
