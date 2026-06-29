using backend.DTOs.Task;

namespace backend.DTOs
{
    public record KanbanColumnDto(string Id, string Title, List<Guid> TaskIds);

    public record KanbanBoardDto(
        List<TaskDto> Tasks,
        Dictionary<string, KanbanColumnDto> Columns,
        List<string> columnsOrder
    );
}
