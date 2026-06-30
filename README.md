# University Project Management System (Academia Workspace)

A comprehensive, high-performance platform designed to bridge the gap between computer engineering students and supervising professors during graduation projects. The system streamlines task tracking, progress auditing, and milestone-based academic grading.

---

## 🚀 Key Business Workflows

### 🧑‍🎓 1. The Student Experience
- **Unified Workspace Dashboard:** Access all assigned academic projects from a centralized sidebar navigation.
- **Interactive Kanban Board:** Manage daily deliverables through a responsive board categorized into standard execution phases (`To Do`, `In Progress`, `Review`, `Done`).
- **Optimistic Task Auditing:** Perform seamless task drag-and-drop actions with instantaneous local state rendering, hiding server-side API latency.
- **Milestone Linking:** Bind daily technical tasks to overarching project milestones to ensure all work aligns with grading criteria.

### 👨‍🏫 2. The Professor Workspace
- **Team Progress Monitoring:** Audit multiple assigned student groups from a single dashboard, with direct read-access to live team Kanban boards.
- **Milestone-Based Grading Engine:** Break down overall project grades into phased deliverables rather than a single end-of-term evaluation.
- **Granular Academic Evaluation:** Review task distribution and individual contributions within a team to award fair, isolated grades per student.

---

## 🏗️ Technical Architecture & Design Philosophy

### Monolithic (Backend)
- **Framework:** .NET Core API.
- **Data Access:** Direct DbContext Injection using Entity Framework Core, optimizing for speed and rapid iteration of business logic by eliminating redundant abstraction layers.
- **Consistent API Design:** Implementation of a unified response filtering wrapper ensuring predictable payload delivery across all endpoints.

### Edge Hybrid Architecture (Frontend)
- **Framework:** Next.js 16 utilizing strict TypeScript and styled with TailwindCSS.
- **State Synchronicity:** Driven by React 19 Client components, utilizing native `useTransition` and `useOptimistic` synchronization models to provide zero-latency UI updates while server actions commit mutations to the database.
- **Layout Optimization:** Modular component tree architecture split logically into atomic layers (`Board`, `Column`, `Card`) ensuring decoupled DOM contexts and preventing generic layout shifts during drag events.

---

## 🗺️ System Roadmap
- [x] Agile Kanban Board System with Reactive Client-Side Engine.
- [ ] Core Database Migrations for **Project Milestones Entity** inside .NET.
- [ ] Task-to-Milestone Relational Mapping API.
- [ ] Academic Grading and Feedback Submit Controllers for Professors.
- [ ] Real-time Progress Tracking and Team Audit Logs.