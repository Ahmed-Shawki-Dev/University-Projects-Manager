using backend.Data;
using backend.Models;
using backend.Notifications.Events;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Notifications.Handlers
{
    public class TaskStatusChangedHandler(ApplicationDbContext context)
        : INotificationHandler<TaskStatusChangedEvent>
    {
        public async System.Threading.Tasks.Task Handle(
            TaskStatusChangedEvent notification,
            CancellationToken cancellationToken
        )
        {
            var actorName = await context
                .Users.Where(u => u.Id == notification.ActorUserId)
                .Select(u => u.FullName)
                .FirstOrDefaultAsync(cancellationToken);

            var newNotification = new ProjectActivity
            {
                ProjectId = notification.ProjectId,
                Message =
                    $"{actorName} changed '{notification.TaskTitle}' status to {notification.NewStatus}",
            };

            context.ProjectActivities.Add(newNotification);
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
