# 🚀 Back-End Roadmap & TODOs

## [ ] Academic Year & Semester Context

- [ ] Add `AcademicYear` and `Semester` columns to `Project` model.
- [ ] Update `CheckFacultyContextFilter` to include global semester check.

## [ ] Team Assembly Flow

- [ ] Create endpoint for Leader to generate Invitation Link.
- [ ] Implement `AddStudentToTeam` logic with Faculty verification.

## [ ] Security & Team-Level Isolation (The Anti-IDOR Shield)

- [ ] Implement `CheckTeamContextFilter` or update the global filter.
- [ ] Ensure that a student can ONLY view or modify resources (Tasks, Milestones, Projects) if their `StudentId` is part of the `StudentTeams` join table for that specific resource context.

## [ ] Refactor Project & Team Creation Logic (The Self-Service Flow)

- [ ] Remove Student Project Creation: Restrict project creation to ADMIN/DOCTOR only.
- [ ] Implement Project Pool Lookup: Allow students to view the list of available projects created by the Admin.
- [ ] Implement Self-Join Team Logic: When a student selects an available project, if no team exists for it, create the team and make this student the Leader. If a team already exists, allow other students to join the team directly (Self-Service) without invitation links, up to the team limit.
