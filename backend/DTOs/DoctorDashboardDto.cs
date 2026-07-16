namespace backend.DTOs;

public record DoctorDashboardStatsCards(
    int ProjectsCount,
    int StudentsCount,
    int FinishedTasksCount
);

public record DoctorDashboardMilestoneDto(
    Guid Id,
    string Title,
    string ProjectName,
    DateTime DueDate
);

public record DoctorDashboardAlertDto(
    Guid Id,
    string ProjectName,
    string AlertType,
    string Message,
    DateTime DueDate
);

public record DoctorDashboardResponseDto(
    DoctorDashboardStatsCards StatsCards,
    List<DoctorDashboardMilestoneDto> UpcomingMilestones,
    List<DoctorDashboardAlertDto> DoctorAlerts
);
