using backend.Data;
using backend.Hubs;
using backend.Models;
using backend.Notifications.Event;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Notifications.Handler;

public class TaskChangedHandler(ApplicationDbContext context, IHubContext<ProjectHub> hub)
    : INotificationHandler<TaskChangedEvent>
{
    public async System.Threading.Tasks.Task Handle(
        TaskChangedEvent notification,
        CancellationToken cancellationToken
    )
    {
        // Record Activity
        var actorName = await context
            .Users.Where(u => u.Id == notification.ActorUserId)
            .Select(u => u.FullName)
            .FirstOrDefaultAsync(cancellationToken);

        var newActivity = new ProjectActivity
        {
            ProjectId = notification.ProjectId,
            Message = $"{actorName} {notification.Message}",
        };

        context.ProjectActivities.Add(newActivity);
        await context.SaveChangesAsync(cancellationToken);

        string projectId = notification.ProjectId.ToString();

        await hub
            .Clients.Group(projectId)
            .SendAsync(
                "TaskStatusUpdated",
                new { taskId = notification.TaskId },
                cancellationToken
            );
    }
}
