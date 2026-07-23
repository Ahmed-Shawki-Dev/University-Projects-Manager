using backend.DTOs;
using backend.Models;

namespace backend.Mappers;

public static class TaskCommentMappers
{
    public static TaskCommentDto ToDto(this TaskComment comment)
    {
        CommentAuthorDto author;

        if (comment.Student != null)
        {
            author = new CommentAuthorDto(
                comment.Student.Id,
                comment.Student.User.FullName ?? "Student",
                "Student"
            );
        }
        else if (comment.Doctor != null)
        {
            author = new CommentAuthorDto(
                comment.Doctor.Id,
                comment.Doctor.User?.FullName ?? "Doctor",
                "Doctor"
            );
        }
        else
        {
            author = new CommentAuthorDto(Guid.Empty, "Unknown", "Unknown");
        }

        return new TaskCommentDto(comment.Id, comment.Content, comment.CreatedAt, author);
    }
}
