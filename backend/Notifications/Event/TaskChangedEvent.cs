using MediatR;

namespace backend.Notifications.Event;

public record TaskChangedEvent(Guid TaskId, Guid ProjectId, string Message, Guid ActorUserId)
    : INotification;
