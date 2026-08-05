using backend.DTOs;
using backend.Models;

namespace backend.Mappers;

public static class StudentMapper
{
    public static StudentDto ToDto(this Student student)
    {
        return new StudentDto(
            student.Id,
            student?.User.FullName ?? "N/A",
            student?.User.Email ?? "N/A",
            student?.StudentCode ?? "N/A"
        );
    }
}
