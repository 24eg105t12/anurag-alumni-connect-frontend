# Anurag Alumni Connect - Frontend (React 19 + Tailwind CSS)

This is the independent Frontend for the Anurag University Alumni Connect platform.

## Tech Stack
- **Framework**: React 19 SPA
- **Styling**: Tailwind CSS v4 (with Anurag University Maroon `#8B1A1A` & Gold `#C9922D` branding)
- **Icons**: Lucide React
- **Build Tool**: Vite 8
- **Typography**: Plus Jakarta Sans & JetBrains Mono

## Project Structure
```
frontend/
├── package.json
├── vite.config.ts
├── index.html
├── README.md
└── src/
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Sidebar.tsx
    │   ├── BottomNav.tsx
    │   ├── SpringBootModal.tsx
    │   ├── DemoSwitcherModal.tsx
    │   ├── feed/FeedView.tsx
    │   ├── questions/QuestionsView.tsx
    │   ├── opportunities/OpportunitiesView.tsx
    │   ├── reviews/ReviewsView.tsx
    │   ├── alumni/AlumniDirectoryView.tsx
    │   ├── profile/ProfileView.tsx
    │   ├── admin/AdminView.tsx
    │   └── auth/AuthModal.tsx
    ├── services/
    │   ├── storage.ts
    │   └── springBootCode.ts
    ├── types/index.ts
    ├── data/initialData.ts
    ├── App.tsx
    ├── main.tsx
    └── index.css
```

## Running Locally

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

App runs on **http://localhost:3000** and connects to the Spring Boot REST API at **http://localhost:8080/api/v1**.
