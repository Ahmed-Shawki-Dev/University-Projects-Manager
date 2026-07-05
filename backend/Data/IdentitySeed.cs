using Microsoft.AspNetCore.Identity;

namespace backend.Data
{
    public static class IdentitySeed
    {
        public static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
        {
            string[] roleNames = { "SuperAdmin", "Admin", "Doctor", "Student" };

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);

                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
                }
            }
        }
    }
}
