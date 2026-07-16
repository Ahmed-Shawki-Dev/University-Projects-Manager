using System.Security.Claims;

namespace backend.Utils;

public static class SecurityHelper
{
    // Check If User Related To University And Faculty Or Not
    public static bool IsAuthorizedForTenant(
        ClaimsPrincipal user,
        string routeUniversitySlug,
        string routeFacultySlug
    )
    {
        var tokenUniversity = user.FindFirstValue("universitySlug");
        var tokenFaculty = user.FindFirstValue("facultySlug");

        if (string.IsNullOrEmpty(tokenUniversity) || string.IsNullOrEmpty(tokenFaculty))
        {
            return false;
        }

        var isUniversityValid = tokenUniversity.Equals(
            routeUniversitySlug,
            StringComparison.OrdinalIgnoreCase
        );
        var isFacultyValid = tokenFaculty.Equals(
            routeFacultySlug,
            StringComparison.OrdinalIgnoreCase
        );

        return isUniversityValid && isFacultyValid;
    }
}
