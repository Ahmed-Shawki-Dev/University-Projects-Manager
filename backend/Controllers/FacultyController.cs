using backend.Data;
using backend.DTOs;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/university/{universitySlug}/faculties")]
    public class FacultyController(ApplicationDbContext context) : BaseApiController
    {
        // Get All Faculties Related To University
        [HttpGet]
        public async Task<IActionResult> GetAll([FromRoute] string universitySlug)
        {
            var university = await context
                .Universities.AsNoTracking()
                .Include(u => u.Faculties)
                .FirstOrDefaultAsync(u => u.Slug == universitySlug);
            if (university == null)
            {
                return CustomNotFound("There Is No University With This Slug", []);
            }
            var facultiesDto = university.Faculties.Select(f => f.ToDto()).ToList();

            return Success(facultiesDto, "The Faculties Retrieved Successfully");
        }

        [AllowAnonymous]
        [HttpGet("{facultySlug}")]
        // Get Faculty By Slug
        public async Task<IActionResult> GetBySlug(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug
        )
        {
            var isUniversityExist = await context.Universities.AnyAsync(u =>
                u.Slug == universitySlug
            );
            if (!isUniversityExist)
            {
                return CustomNotFound("University Not Found", []);
            }
            var faculty = await context
                .Faculties.Include(f => f.University)
                .FirstOrDefaultAsync(f => f.Slug == facultySlug);
            if (faculty == null)
            {
                return CustomNotFound("University Not Found", []);
            }
            return Success(faculty.ToFacultyWithUniversityDto(), "Faculty Retrieved Successfully");
        }

        // Add Faculty To University
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromRoute] string universitySlug,
            [FromBody] CreateFacultyDto facultyDto
        )
        {
            var university = await context.Universities.FirstOrDefaultAsync(u =>
                u.Slug == universitySlug
            );

            if (university == null)
            {
                return CustomNotFound("University Not Found", []);
            }

            var facultyModel = facultyDto.FromCreateDtoToModel();
            facultyModel.UniversityId = university.Id;

            context.Faculties.Add(facultyModel);
            await context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetBySlug),
                new { universitySlug = universitySlug, facultySlug = facultyModel.Slug },
                facultyModel.ToDto()
            );
        }

        // Update Faculty
        [HttpPut("{facultySlug}")]
        public async Task<IActionResult> Update(
            [FromRoute] string universitySlug,
            [FromRoute] string facultySlug,
            [FromBody] UpdateFacultyDto updateDto
        )
        {
            var facultyModel = await context.Faculties.FirstOrDefaultAsync(f =>
                f.Slug == facultySlug && f.University.Slug == universitySlug
            );

            if (facultyModel == null)
            {
                return CustomNotFound("The Faculty Not Found", []);
            }

            facultyModel.Name = updateDto.Name;

            await context.SaveChangesAsync();

            return Success(facultyModel.ToDto(), "Faculty Updated Successfully");
        }

        // Remove Faculty
        [HttpDelete("{facultySlug}")]
        public async Task<IActionResult> Remove(
            [FromRoute] string facultySlug,
            [FromRoute] string universitySlug
        )
        {
            var facultyModel = await context.Faculties.FirstOrDefaultAsync(f =>
                f.Slug == facultySlug && f.University.Slug == universitySlug
            );
            if (facultyModel == null)
            {
                return CustomNotFound("The Faculty Not Founded", []);
            }

            context.Faculties.Remove(facultyModel);
            await context.SaveChangesAsync();
            return NoContent();
        }

        // ** Get Layout Details && Check Slugs
        [AllowAnonymous]
        [HttpGet("/api/universities/{universitySlug}/faculties/{facultySlug}/layout-details")]
        public async Task<IActionResult> GetLayoutDetails(string universitySlug, string facultySlug)
        {
            var isAuthenticated = User.Identity?.IsAuthenticated ?? false;

            if (isAuthenticated)
            {
                var tokenUniversity = User.FindFirst("universitySlug")?.Value;
                var tokenFaculty = User.FindFirst("facultySlug")?.Value;

                if (tokenUniversity != universitySlug || tokenFaculty != facultySlug)
                {
                    return Forbid();
                }
            }

            var data = await context
                .Faculties.Include(f => f.University)
                .FirstOrDefaultAsync(f =>
                    f.Slug == facultySlug && f.University.Slug == universitySlug
                );

            if (data == null)
            {
                return CustomNotFound("The University or faculty not found", []);
            }

            return Success(data.ToFacultyWithUniversityDto(), "Data Retrieved Successfully");
        }
    }
}
