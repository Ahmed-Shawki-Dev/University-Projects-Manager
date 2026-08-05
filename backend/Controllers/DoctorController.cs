using backend.Data;
using backend.DTOs;
using backend.Mappers;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize(Roles = "Admin")]
[Route("/api/universities/{universitySlug}/faculties/{facultySlug}/doctors")]
public class DoctorController(ApplicationDbContext context, UserManager<AppUser> userManager)
    : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetAllDoctors(
        [FromRoute] string universitySlug,
        [FromRoute] string facultySlug
    )
    {
        if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
        {
            return Forbid();
        }

        var doctors = await context
            .Doctors.Include(d => d.User)
            .Where(d =>
                d.Faculty.Slug == facultySlug && d.Faculty.University.Slug == universitySlug
            )
            .ToListAsync();

        var doctorDtos = doctors.Select(d => d.ToDto()).ToList();

        return Success(doctorDtos, "Doctors retrieved successfully.");
    }

    [HttpGet("{doctorId}")]
    public async Task<IActionResult> GetDoctor(
        [FromRoute] string universitySlug,
        [FromRoute] string facultySlug,
        [FromRoute] Guid doctorId
    )
    {
        if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
        {
            return Forbid();
        }

        var doctor = await context
            .Doctors.Include(d => d.User)
            .FirstOrDefaultAsync(d =>
                d.Id == doctorId
                && d.Faculty.Slug == facultySlug
                && d.Faculty.University.Slug == universitySlug
            );

        if (doctor == null)
        {
            return CustomNotFound("Doctor Not Exist.", []);
        }

        var doctorDto = doctor.ToDto();

        return Success(doctorDto, "Doctors retrieved successfully.");
    }

    // ** Register A New Doctor
    [HttpPost]
    public async Task<IActionResult> CreateDoctor(
        [FromRoute] string universitySlug,
        [FromRoute] string facultySlug,
        [FromBody] CreateDoctorDto dto
    )
    {
        if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
        {
            return Forbid();
        }

        var faculty = await context.Faculties.FirstOrDefaultAsync(f =>
            f.Slug == facultySlug && f.University.Slug == universitySlug
        );

        if (faculty == null)
        {
            return CustomNotFound("Faculty or University not found.", []);
        }

        using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
            };

            var result = await userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return CustomBadRequest("Failed to create doctor account.", errors);
            }

            await userManager.AddToRoleAsync(user, "Doctor");

            var doctor = new Doctor
            {
                UserId = user.Id,
                FacultyId = faculty.Id,
                AcademicRank = dto?.AcademicRank??"N/A",
            };

            await context.Doctors.AddAsync(doctor);
            await context.SaveChangesAsync();

            await transaction.CommitAsync();

            return Success("Doctor added successfully.");
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
