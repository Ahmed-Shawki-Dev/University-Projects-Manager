using backend.DTOs;
using backend.Models;

namespace backend.Mappers
{
    public static class MilestoneMapper
    {
        public static MilestoneDto ToDto(this Milestone milestone)
        {
            return new MilestoneDto(
                milestone.Id,
                milestone.Title,
                milestone.Description,
                milestone.MaxGrade,
                milestone.StartDate,
                milestone.DueDate,
                milestone.ProjectId
            );
        }

        public static Milestone FromCreateToModel(this CreateMilestoneDto milestoneDto)
        {
            return new Milestone
            {
                Title = milestoneDto.Title,
                Description = milestoneDto.Description,
                MaxGrade = milestoneDto.MaxGrade,
                StartDate = milestoneDto.StartDate.ToUniversalTime(),
                DueDate = milestoneDto.DueDate.ToUniversalTime(),
            };
        }
    }
}
