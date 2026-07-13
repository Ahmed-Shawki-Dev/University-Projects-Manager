using backend.DTOs;
using backend.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [ServiceFilter(typeof(CheckFacultyContextFilter))]
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected IActionResult Success<T>(T data, string message)
        {
            return Ok(
                new ApiResponse<T>
                {
                    IsSuccess = true,
                    Message = message,
                    Data = data,
                    Errors = [],
                }
            );
        }

        protected IActionResult Success(string message)
        {
            return Ok(
                new ApiResponse<object>
                {
                    IsSuccess = true,
                    Message = message,
                    Data = null,
                    Errors = [],
                }
            );
        }

        protected IActionResult CustomCreateAtAction<T>(
            string actionName,
            object routeValue,
            T data,
            string message
        )
        {
            var response = new ApiResponse<T>
            {
                IsSuccess = true,
                Message = message,
                Data = data,
                Errors = [],
            };

            return CreatedAtAction(actionName, routeValue, response);
        }

        protected IActionResult CustomBadRequest(string message, List<string>? errors)
        {
            return BadRequest(
                new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = message,
                    Data = new List<object>(),
                    Errors = errors ?? [],
                }
            );
        }

        protected IActionResult CustomNotFound(string message, List<string>? errors)
        {
            return NotFound(
                new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = message,
                    Data = new List<object>(),
                    Errors = errors ?? [],
                }
            );
        }

        protected IActionResult CustomUnauthorized(string message)
        {
            return Unauthorized(
                new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = message,
                    Data = new List<object>(),
                    Errors = [],
                }
            );
        }
    }
}
