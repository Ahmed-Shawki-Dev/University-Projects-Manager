using backend.DTOs;
using backend.DTOs.Faculty;
using backend.Models;

namespace backend.Mappers
{
    public static class FacultyMapper
    {
        public static Faculty FromCreateDtoToModel(this CreateFacultyDto facultyDto)
        {
            return new Faculty { Name = facultyDto.Name, Slug = facultyDto.Slug };
        }

        public static Faculty FromUpdateDtoToModel(this UpdateFacultyDto facultyDto)
        {
            return new Faculty { Name = facultyDto.Name };
        }

        public static FacultyDto ToDto(this Faculty faculty)
        {
            return new FacultyDto
            {
                Name = faculty.Name,
                Id = faculty.Id,
                Slug = faculty.Slug,
                UniversityId = faculty.UniversityId,
            };
        }

        public static FacultyDto ToFacultyWithUniversityDto(this Faculty faculty)
        {
            return new FacultyDto
            {
                Name = faculty.Name,
                Id = faculty.Id,
                Slug = faculty.Slug,
                UniversityId = faculty.UniversityId,
                University =
                    faculty.University != null
                        ? new UniversityDto
                        {
                            Id = faculty.University.Id,
                            Name = faculty.University.Name,
                            Slug = faculty.University.Slug,
                        }
                        : null,
            };
        }
    }
}
