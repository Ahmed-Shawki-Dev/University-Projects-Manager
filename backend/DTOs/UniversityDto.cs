using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record UniversityDto(Guid Id, string Name, string Slug);

public record CreateUniversityDto(
    [Required(ErrorMessage = "Name Must Be Not Empty")]
    [StringLength(
        100,
        MinimumLength = 2,
        ErrorMessage = "Name Must Be Between 2 And 100 Character"
    )]
        string Name,
    [Required(ErrorMessage = "Slug Must Be Not Empty")]
    [RegularExpression(
        @"^[a-z0-9-]+$",
        ErrorMessage = "Slug Must Be Small Characters Or Numbers Separated By -"
    )]
        string Slug
);

public record UpdateUniversityDto(
    [Required(ErrorMessage = "Name Must Be Not Empty")]
    [StringLength(
        100,
        MinimumLength = 2,
        ErrorMessage = "Name Must Be Between 2 And 100 Character"
    )]
        string Name
);
