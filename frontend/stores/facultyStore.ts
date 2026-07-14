// stores/facultyStore.ts
import { FacultyLayoutDto } from "@/types/schema";
import { create } from "zustand";

interface FacultyState {
  facultyData: FacultyLayoutDto | null;
  setFacultyData: (data: FacultyLayoutDto) => void;
}

export const useFacultyStore = create<FacultyState>((set) => ({
  facultyData: null,
  setFacultyData: (data) => set({ facultyData: data }),
}));
