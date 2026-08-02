using backend.DTOs;
using backend.Models;

namespace backend.Mappers;

public static class DoctorMapper
{
    public static DoctorDto ToDto(this Doctor doctor)
    {
        return new DoctorDto(doctor.Id, doctor.User?.FullName ?? "N/A", doctor.AcademicRank);
    }
}
