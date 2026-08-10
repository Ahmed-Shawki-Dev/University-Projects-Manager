using backend.DTOs;
using backend.Models;

namespace backend.DTOs
{
    public record KanbanColumnDto(TaskStatusEnum Id, string Title, List<Guid> TaskIds);

    public record KanbanBoardDto(
        Guid ProjectId,
        List<TaskDto> Tasks,
        Dictionary<TaskStatusEnum, KanbanColumnDto> Columns,
        List<TaskStatusEnum> ColumnsOrder
    );
}
