"use client";

import { useFacultyStore } from "@/stores/facultyStore";
import { FacultyLayoutDto } from "@/types/schema";
import { useEffect } from "react";

export function FacultyInitializer({ data }: { data: FacultyLayoutDto }) {
  const currentFacultyData = useFacultyStore((state) => state.facultyData);

  useEffect(() => {
    if (JSON.stringify(currentFacultyData) !== JSON.stringify(data)) {
      useFacultyStore.setState({ facultyData: data });
    }
  }, [data, currentFacultyData]);

  return null;
}
