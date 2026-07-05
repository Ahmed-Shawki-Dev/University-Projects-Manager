using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class AppUser : IdentityUser<Guid>
    {
        public string FullName { get; set; } = string.Empty;

        public Student? Student { get; set; }
    }
}
