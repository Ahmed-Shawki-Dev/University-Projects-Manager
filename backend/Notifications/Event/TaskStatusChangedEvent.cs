using backend.Models;
using MediatR;

namespace backend.Notifications.Events
{
    public record TaskStatusChangedEvent(
        Guid TaskId,
        string TaskTitle,
        TaskStatusEnum OldStatus,
        TaskStatusEnum NewStatus,
        Guid ProjectId,
        Guid ActorUserId
    ) : INotification;
}
