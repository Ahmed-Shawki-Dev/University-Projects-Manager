using backend.Models;
using MediatR;

namespace backend.Notifications.Events
{
    public record TaskStatusChangedEvent(
        Guid TaskId,
        string TaskTitle,
        TaskStatusEnum NewStatus,
        Guid ProjectId,
        Guid ActorUserId
    ) : INotification;
}
