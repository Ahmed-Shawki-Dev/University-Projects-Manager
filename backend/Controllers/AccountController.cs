using backend.Data;
using backend.DTOs.User;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/auth")]
    public class AccountController(UserManager<AppUser> userManager, ApplicationDbContext context)
        : BaseApiController
    {
        // ** Register Student API
        [HttpPost("register/{universitySlug}/{facultySlug}/student")]
        public async Task<IActionResult> RegisterStudent(
            string universitySlug,
            string facultySlug,
            [FromBody] UserRegisterDto user
        )
        {
            var faculty = await context
                .Faculties.Include(f => f.University)
                .FirstOrDefaultAsync(f =>
                    f.Slug == facultySlug && f.University.Slug == universitySlug
                );

            if (faculty == null)
            {
                return CustomBadRequest("No University Or Faculty With This Name.", []);
            }
            var userModel = await userManager.FindByEmailAsync(user.Email);

            if (userModel != null)
            {
                return CustomBadRequest("The Email Is Already Exist.", []);
            }

            var appUser = new AppUser()
            {
                Email = user.Email,
                FullName = user.FullName,
                UserName = user.Email,
            };

            // Using Transaction
            using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                var result = await userManager.CreateAsync(appUser, user.Password);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(appUser, "Student");
                    var student = new Student
                    {
                        Id = Guid.NewGuid(),
                        StudentCode = user.StudentCode,
                        FacultyId = faculty.Id,
                        UserId = appUser.Id,
                    };

                    context.Students.Add(student);
                    await context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return Success(user, "User Added Successfully To The University.");
                }
                var errorMessages = result.Errors.Select(e => e.Description).ToList();

                return CustomBadRequest("There Is Error Happen", errorMessages);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return CustomBadRequest("An unexpected error occurred during registration.", []);
            }
        }
    }
}
