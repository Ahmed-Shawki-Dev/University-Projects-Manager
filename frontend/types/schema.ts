export interface FacultyDto {
  id: string;
  name: string;
  slug: string;
  universityId: string;
}

export interface CreateFacultyDto {
  name: string;
  slug: string;
}
export interface UpdateFacultyDto {
  name: string;
}

export interface UniversityDto {
  id: string;
  name: string;
  slug: string;
}

export interface CreateUniversityDto {
  name: string;
  slug: string;
}

export interface UpdateUniversityDto {
  name: string;
}
