using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace backend.Filters
{
    public class CheckFacultyContextFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(
            ActionExecutingContext context,
            ActionExecutionDelegate next
        )
        {
            var hasAllowAnonymous = context.ActionDescriptor.EndpointMetadata.Any(em =>
                em is AllowAnonymousAttribute
            );

            if (hasAllowAnonymous)
            {
                await next();
                return;
            }

            if (
                !context.RouteData.Values.TryGetValue("universitySlug", out var uniSlugObj)
                || !context.RouteData.Values.TryGetValue("facultySlug", out var facSlugObj)
            )
            {
                await next();
                return;
            }

            string routeUniversity = uniSlugObj?.ToString() ?? "";
            string routeFaculty = facSlugObj?.ToString() ?? "";

            var tokenUniversity = context
                .HttpContext.User.Claims.FirstOrDefault(c =>
                    c.Type.Equals("universitySlug", StringComparison.OrdinalIgnoreCase)
                )
                ?.Value;

            var tokenFaculty = context
                .HttpContext.User.Claims.FirstOrDefault(c =>
                    c.Type.Equals("facultySlug", StringComparison.OrdinalIgnoreCase)
                )
                ?.Value;

            // if (
            //     !string.Equals(routeUniversity, tokenUniversity, StringComparison.OrdinalIgnoreCase)
            //     || !string.Equals(routeFaculty, tokenFaculty, StringComparison.OrdinalIgnoreCase)
            // )
            // {
            //     context.Result = new ForbidResult();
            //     return;
            // }

            await next();
        }
    }
}
