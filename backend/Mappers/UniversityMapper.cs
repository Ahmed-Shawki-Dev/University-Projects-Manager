using backend.DTOs;
using backend.DTOs.University;
using backend.Models;

namespace backend.Mappers
{
    public static class UniversityMapper
    {
        public static University FromCreateDtoToModel(this CreateUniversityDto universityDto)
        {
            return new University { Name = universityDto.Name, Slug = universityDto.Slug };
        }

        public static University FromUpdateDtoToModel(this UpdateUniversityDto universityDto)
        {
            return new University { Name = universityDto.Name };
        }

        public static UniversityDto ToDto(this University university)
        {
            return new UniversityDto
            {
                Name = university.Name,
                Id = university.Id,
                Slug = university.Slug,
            };
        }
    }
}
