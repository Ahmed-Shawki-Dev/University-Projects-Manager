namespace backend.DTOs;

public record StudentDashboardCardStats(
    int PendingTasks,
    int InProgressTasks,
    int OverdueMilestones
);

public record StudentDashboardCurrentMilestoneProgressDto(
    Guid Id,
    string Title,
    string Description,
    DateTime DueDate,
    int TotalTasksCount,
    int CompletedTasksCount,
    double ProgressPercentage
);

public record StudentDashboardResponseDto(
    StudentDashboardCardStats Stats,
    StudentDashboardCurrentMilestoneProgressDto? CurrentMilestone
);
