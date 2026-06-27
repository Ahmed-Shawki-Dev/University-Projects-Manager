using backend.DTOs;
using backend.Models;

namespace backend.Mappers
{
    public static class UniversityMapper
    {
        public static University ToModel(this CreateUniversityDto universityDto)
        {
            return new University { Name = universityDto.Name, Slug = universityDto.Slug };
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
