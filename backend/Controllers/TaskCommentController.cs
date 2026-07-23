using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("/api/tasks/{taskId}/comments")]
    public class TaskCommentController(ApplicationDbContext context) : BaseApiController
    {
        // ** Get All Task Comments
        [HttpGet]
        public async Task<IActionResult> GetAllTaskComments([FromRoute] Guid taskId)
        {
            var taskExists = await context.Tasks.AsNoTracking().AnyAsync(t => t.Id == taskId);
            if (!taskExists)
            {
                return CustomNotFound("Task Not Found", []);
            }
            var comments = await context
                .TaskComments.AsNoTracking()
                .Include(tc => tc.Student)
                    .ThenInclude(s => s!.User)
                .Include(tc => tc.Doctor)
                    .ThenInclude(d => d!.User)
                .Where(tc => tc.TaskId == taskId)
                .OrderBy(tc => tc.CreatedAt)
                .ToListAsync();
            var commentsDto = comments.Select(comment => comment.ToDto()).ToList();

            return Success(commentsDto, "Comments Retrieved Successfully");
        }

        // ** Get Task Comment By Id
        [HttpGet("{commentId:guid}")]
        public async Task<IActionResult> GetTaskCommentById(
            [FromRoute] Guid taskId,
            [FromRoute] Guid commentId
        )
        {
            var comment = await context
                .TaskComments.AsNoTracking()
                .Include(tc => tc.Student)
                    .ThenInclude(s => s!.User)
                .Include(tc => tc.Doctor)
                    .ThenInclude(d => d!.User)
                .FirstOrDefaultAsync(tc => tc.Id == commentId && tc.TaskId == taskId);

            if (comment == null)
            {
                return CustomNotFound("Comment Not Found", []);
            }

            return Success(comment.ToDto(), "Comment Retrieved Successfully");
        }

        // ** Create Task Comment
        [HttpPost]
        public async Task<IActionResult> CreateTaskComment(
            [FromRoute] Guid taskId,
            CreateTaskCommentDto comment
        )
        {
            var taskExists = await context.Tasks.AsNoTracking().AnyAsync(t => t.Id == taskId);
            if (!taskExists)
            {
                return CustomNotFound("Task Not Found", []);
            }

            var studentIdClaim = User.FindFirstValue("studentId");
            var doctorIdClaim = User.FindFirstValue("doctorId");

            var commentModel = new TaskComment { Content = comment.Content, TaskId = taskId };

            if (studentIdClaim != null)
            {
                commentModel.StudentId = Guid.Parse(studentIdClaim);
            }
            else if (doctorIdClaim != null)
            {
                commentModel.DoctorId = Guid.Parse(doctorIdClaim);
            }
            else
            {
                return CustomBadRequest("No User Identity Found", []);
            }

            context.TaskComments.Add(commentModel);
            await context.SaveChangesAsync();

            var createdComment = await context
                .TaskComments.AsNoTracking()
                .Include(tc => tc.Student)
                    .ThenInclude(s => s!.User)
                .Include(tc => tc.Doctor)
                    .ThenInclude(d => d!.User)
                .FirstOrDefaultAsync(tc => tc.Id == commentModel.Id);

            return CustomCreateAtAction(
                nameof(GetTaskCommentById),
                new { taskId = taskId, commentId = commentModel.Id },
                createdComment!.ToDto(),
                "Comment Created Successfully"
            );
        }
    }
}
