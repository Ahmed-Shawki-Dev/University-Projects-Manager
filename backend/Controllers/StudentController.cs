using backend.Data;
using backend.Mappers;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize(Roles = "Admin")]
[Route("/api/universities/{universitySlug}/faculties/{facultySlug}/students")]
public class StudentController(ApplicationDbContext context) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetAllAdminStudents(
        [FromRoute] string universitySlug,
        [FromRoute] string facultySlug
    )
    {
        if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
        {
            return Forbid();
        }

        var students = await context
            .Students.AsNoTracking()
            .Include(s => s.User)
            .Where(s =>
                s.Faculty!.Slug == facultySlug && s.Faculty.University.Slug == universitySlug
            )
            .ToListAsync();

        var studentDtos = students.Select(s => s.ToDto()).ToList();

        return Success(studentDtos, "Students retrieved successfully.");
    }

    [HttpGet("{studentId}")]
    public async Task<IActionResult> GetAdminStudent(
        [FromRoute] string universitySlug,
        [FromRoute] string facultySlug,
        [FromRoute] Guid studentId
    )
    {
        if (!SecurityHelper.IsAuthorizedForTenant(User, universitySlug, facultySlug))
        {
            return Forbid();
        }

        var student = await context
            .Students.Include(s => s.User)
            .FirstOrDefaultAsync(s =>
                s.Faculty!.Slug == facultySlug
                && s.Faculty.University.Slug == universitySlug
                && s.Id == studentId
            );

        if (student == null)
        {
            return CustomNotFound("Student Not Exist.", []);
        }

        var studentDto = student.ToDto();

        return Success(studentDto, "Student retrieved successfully.");
    }
}
