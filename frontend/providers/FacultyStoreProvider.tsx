"use client";

import { useFacultyStore } from "@/stores/facultyStore";
import { FacultyLayoutDto } from "@/types/schema";

export function FacultyInitializer({ data }: { data: FacultyLayoutDto }) {
  const currentFacultyData = useFacultyStore((state) => state.facultyData);

  console.log(currentFacultyData);

  if (JSON.stringify(currentFacultyData) !== JSON.stringify(data)) {
    useFacultyStore.setState({ facultyData: data });
  }

  return null;
}
