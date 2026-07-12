using backend.DTOs;
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
            return new FacultyDto(faculty.Id, faculty.Name, faculty.Slug, faculty.UniversityId);
        }

        public static FacultyDto ToFacultyWithUniversityDto(this Faculty faculty)
        {
            return new FacultyDto(
                faculty.Id,
                faculty.Name,
                faculty.Slug,
                faculty.UniversityId,
                faculty.University != null
                    ? new UniversityDto(
                        faculty.University.Id,
                        faculty.University.Name,
                        faculty.University.Slug
                    )
                    : null
            );
        }
    }
}
