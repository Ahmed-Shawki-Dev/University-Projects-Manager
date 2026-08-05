# UniProjects - Multi-Tenant University Project Management System

A Multi-Tenant SaaS platform designed specifically for universities to streamline graduation and course projects management. Built with a decoupled architecture separating a .NET 10 Backend API from a Next.js Frontend interface.

---

## Architecture & Core Concepts

### 1. Multi-Tenant Isolation & Security
- Strict Tenant Scope: Data isolation enforced across Universities and Faculties using dynamic URL Slugs (`/app/{universitySlug}/{facultySlug}/...`).
- Authorization: Requests are validated against JWT Claims and Tenant Context via custom security policies, returning 403 Forbidden for cross-tenant unauthorized access.

### 2. Backend Design
- Direct DbContext Injection: Bypassed traditional Repository Pattern wrappers with EF Core to eliminate unnecessary abstraction boilerplate and maximize performance.
- Read Optimizations: Extensive use of `.AsNoTracking()` for read-heavy administrative operations.

### 3. Frontend Stack
- Next.js App Router & Server Actions: Server-side execution layer with RSC Protocol for clean data flow.
- Type-Safe Validation: Full Schema Validation with Zod integrated into React Hook Form.

---

## Tech Stack

- Backend: .NET 10 Web API, Entity Framework Core, SQL Server, JWT Authentication
- Frontend: Next.js, React 19, TypeScript, Zustand, Tailwind CSS, Shadcn UI
- Form & Validation: React Hook Form, Zod

---

## Key Features

- Multi-Tenant Administration: Separate tenant spaces for different universities and faculties.
- Academic Staff Management: Admin portal to register and manage doctors and faculty members.
- Student Roster Management: Overview of registered students with academic codes and levels.
- Milestones & Grading: Project breakdown into phases with max grade assignments.
