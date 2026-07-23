namespace backend.DTOs;

public record TaskCommentDto(Guid Id, string Content, DateTime CreatedAt, CommentAuthorDto Author);

public record CommentAuthorDto(Guid Id, string Name, string Role);

public record CreateTaskCommentDto(string Content);
