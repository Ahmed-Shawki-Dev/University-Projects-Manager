using backend.Data;
using backend.DTOs;
using backend.DTOs.University;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    public class UniversityController(ApplicationDbContext context) : BaseApiController
    {
        // Get All Universities
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var universities = await context.Universities.AsNoTracking().ToListAsync();
            var universitiesDtos = universities.Select(u => u.ToDto());
            return Success(universitiesDtos, "Get All Universities Successfully");
        }

        // Get Specific University
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug([FromRoute] string slug)
        {
            var university = await context
                .Universities.AsNoTracking()
                .FirstOrDefaultAsync(u => u.Slug == slug);
            if (university != null)
            {
                var universityDto = university.ToDto();
                return Success(universityDto, "Get Specific University Successfully");
            }
            else
            {
                return CustomNotFound("The University Not Found", []);
            }
        }

        // Add University
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUniversityDto universityDto)
        {
            var isExist = await context
                .Universities.AsQueryable()
                .AnyAsync(u => u.Slug == universityDto.Slug);
            if (isExist)
            {
                return CustomBadRequest(
                    "Validation Error",
                    new List<string> { "The provided slug is already taken by another university." }
                );
            }
            else
            {
                var universityModel = universityDto.FromCreateDtoToModel();
                context.Universities.Add(universityModel);
                await context.SaveChangesAsync();
                return CustomCreateAtAction(
                    nameof(GetBySlug),
                    new { slug = universityModel.Slug },
                    universityModel.ToDto(),
                    "University Created Successfully"
                );
            }
        }

        // Update University
        [HttpPut("{slug}")]
        public async Task<IActionResult> Update(
            [FromRoute] string slug,
            [FromBody] UpdateUniversityDto universityDto
        )
        {
            var universityModel = await context.Universities.FirstOrDefaultAsync(u =>
                u.Slug == slug
            );

            if (universityModel == null)
            {
                return CustomNotFound(
                    "The University Not Found",
                    new List<string>() { "Not Found" }
                );
            }

            universityModel.Name = universityDto.Name;

            await context.SaveChangesAsync();
            return Success(universityModel.ToDto(), "University Updated Successfully");
        }

        // Remove University
        [HttpDelete("{slug}")]
        public async Task<IActionResult> Remove([FromRoute] string slug)
        {
            var universityModel = await context.Universities.FirstOrDefaultAsync(u =>
                u.Slug == slug
            );
            if (universityModel == null)
            {
                return CustomNotFound(
                    "The University Not Found",
                    new List<string>() { "Not Found" }
                );
            }
            context.Universities.Remove(universityModel);
            await context.SaveChangesAsync();
            return NoContent();
        }
    }
}
