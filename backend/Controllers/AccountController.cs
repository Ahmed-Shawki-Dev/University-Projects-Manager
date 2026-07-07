using System.Security.Claims;
using backend.Data;
using backend.DTOs.User;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/auth")]
    public class AccountController(
        UserManager<AppUser> userManager,
        ApplicationDbContext context,
        TokenService tokenService
    ) : BaseApiController
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

            var isCodeRegisterd = await context.Students.AnyAsync(s =>
                s.StudentCode == user.StudentCode
            );

            if (isCodeRegisterd)
            {
                return CustomBadRequest("The Student Code is already registered.", []);
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

        // Login Controller
        [HttpPost("login/{universitySlug}/{facultySlug}")]
        public async Task<IActionResult> MyMethodAsync(
            string universitySlug,
            string facultySlug,
            [FromBody] UserLoginDto userLogin
        )
        {
            var user = await userManager.FindByEmailAsync(userLogin.Email);
            if (user == null)
            {
                return CustomUnauthorized("The email or password is wrong.");
            }

            if (await userManager.CheckPasswordAsync(user, userLogin.Password))
            {
                var student = await context
                    .Students.Include(s => s.Faculty)
                        .ThenInclude(f => f!.University)
                    .FirstOrDefaultAsync(s =>
                        s.UserId == user.Id
                        && s.Faculty!.Slug == facultySlug
                        && s.Faculty.University.Slug == universitySlug
                    );

                if (student == null)
                {
                    return CustomBadRequest(
                        "You are not registered in this faculty/university.",
                        []
                    );
                }
                var authClaims = new List<Claim>
                {
                    new Claim("fullName", user.FullName),
                    new Claim("email", user.Email!),
                    new Claim("studentCode", student.StudentCode),
                };

                var token = tokenService.GenerateToken(authClaims);

                return Success(new { user = userLogin, token }, "Welcome");
            }
            else
            {
                return CustomUnauthorized("The email or password is wrong.");
            }
        }
    }
}
