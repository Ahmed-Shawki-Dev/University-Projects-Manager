"use client";

import { useFacultyStore } from "@/stores/facultyStore";
import { FacultyLayoutDto } from "@/types/schema";
import { useEffect } from "react";

export function FacultyInitializer({ data }: { data: FacultyLayoutDto }) {
  const setFacultyData = useFacultyStore((state) => state.setFacultyData);

  useEffect(() => {
    setFacultyData(data);
  }, [data, setFacultyData]);

  return null;
}
