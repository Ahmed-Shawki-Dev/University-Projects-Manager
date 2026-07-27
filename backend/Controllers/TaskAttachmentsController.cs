using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/tasks/{taskId}/attachments")]
    public class TaskAttachmentsController(
        IWebHostEnvironment webHostEnvironment,
        ApplicationDbContext context
    ) : BaseApiController
    {
        // ** Upload Attachment
        [HttpPost]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<IActionResult> UploadTaskAttachments(
            [FromRoute] Guid taskId,
            [FromForm] UploadTaskAttachmentsDto taskAttachments
        )
        {
            // ! Get User Claims
            var userRole = User.FindFirstValue("userRole");
            Guid? studentId =
                userRole == "Student" ? Guid.Parse(User.FindFirstValue("studentId")!) : null;
            Guid? doctorId =
                userRole == "Doctor" ? Guid.Parse(User.FindFirstValue("doctorId")!) : null;
            var uploaderName = User.FindFirstValue("fullName") ?? "Unknown";

            // ! Check Is Task Exist
            var taskExists = await context.Tasks.AnyAsync(t => t.Id == taskId);
            if (!taskExists)
                return CustomNotFound("Task not found", []);

            var allowedExtensions = new[] { ".pdf", ".docx", ".png", ".jpg", ".jpeg", ".zip" };
            var rootPath =
                webHostEnvironment.WebRootPath
                ?? Path.Combine(webHostEnvironment.ContentRootPath, "wwwroot");

            var uploadsPath = Path.Combine(rootPath, "uploads");

            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            if (taskAttachments.Files == null || !taskAttachments.Files.Any())
                return CustomBadRequest("No files were uploaded", []);

            List<TaskAttachment> attachments = new();

            foreach (var File in taskAttachments.Files)
            {
                var fileExtension = Path.GetExtension(File.FileName).ToLowerInvariant();

                if (
                    string.IsNullOrEmpty(fileExtension)
                    || !allowedExtensions.Contains(fileExtension)
                )
                {
                    return CustomBadRequest("Invalid File Type", []);
                }

                var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
                var fullPath = Path.Combine(uploadsPath, uniqueFileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await File.CopyToAsync(stream);
                }

                // ! Connection To Database

                var attachment = new TaskAttachment
                {
                    FileName = File.FileName,
                    FilePath = $"uploads/{uniqueFileName}",
                    FileSize = File.Length,
                    FileType = File.ContentType,
                    TaskId = taskId,
                    StudentId = studentId,
                    DoctorId = doctorId,
                };

                attachments.Add(attachment);
            }
            context.TaskAttachments.AddRange(attachments);
            await context.SaveChangesAsync();

            var attachmentsDtos = attachments.Select(a => a.ToDto(uploaderName));

            return Success(attachmentsDtos, "File Uploaded Successfully");
        }
    }
}
