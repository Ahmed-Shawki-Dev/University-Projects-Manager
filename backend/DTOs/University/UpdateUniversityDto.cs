using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.University
{
    public class UpdateUniversityDto
    {
        [Required(ErrorMessage = "Name Must Be Not Empty")]
        [StringLength(
            100,
            MinimumLength = 2,
            ErrorMessage = "Name Must Be Between 2 And 100 Character"
        )]
        public string Name { get; set; } = string.Empty;
    }
}
