using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateUniversityDto
    {
        [Required(ErrorMessage = "It Must Be Not Empty")]
        [StringLength(
            100,
            MinimumLength = 2,
            ErrorMessage = "Name Must Be Between 2 And 100 Character"
        )]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "It Must Be Not Empty")]
        [RegularExpression(
            @"^[a-z0-9-]+$",
            ErrorMessage = "Slug Must Be Small Characters Or Numbers Separated By -"
        )]
        public string Slug { get; set; } = string.Empty;
    }
}
