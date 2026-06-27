using backend.Data;
using backend.DTOs;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("/api/university")]
    public class UniversityController(ApplicationDbContext context) : ControllerBase
    {
        // Get All Universities
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var universities = await context.Universities.AsNoTracking().ToListAsync();
            var universitiesDtos = universities.Select(u => u.ToDto());
            return Ok(universitiesDtos);
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
                return Ok(universityDto);
            }
            else
            {
                return NotFound();
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
                return BadRequest("The University With The Slug Is Already Exist");
            }
            else
            {
                var universityModel = universityDto.ToModel();
                context.Universities.Add(universityModel);
                await context.SaveChangesAsync();
                return CreatedAtAction(
                    nameof(GetBySlug),
                    new { slug = universityModel.Slug },
                    universityModel.ToDto()
                );
            }
        }
    }
}
