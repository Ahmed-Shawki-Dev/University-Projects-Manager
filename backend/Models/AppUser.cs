using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class AppUser : IdentityUser<Guid>
    {
        public Student? Student { get; set; }
    }
}
