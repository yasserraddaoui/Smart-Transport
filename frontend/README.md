# Smart Transport System – Frontend

Production-style React dashboard that communicates **only through the API Gateway**.

## Prerequisites
- Node.js 18+ (recommended)
- API Gateway running on `http://localhost:8080` (or update env vars)

## Run (development)
1. Start backend stack (from repo root):
   - `docker compose up --build`
2. Go to the frontend:
   - `cd frontend`
3. Create env file:
   - `copy .env.example .env` (Windows PowerShell) or `cp .env.example .env`
4. Install dependencies:
   - `npm install`
5. Start dev server:
   - `npm run dev`
6. Open:
   - `http://localhost:5173`

The dev server proxies `/auth`, `/bus`, `/driver`, `/gps`, `/ticketing`, `/actuator` to the API Gateway at `VITE_GATEWAY_PROXY_TARGET` (default `http://localhost:8080`). This avoids CORS issues and ensures the frontend talks to the gateway only.

## Production build
- `npm run build`
- `npm run preview`

If you want Spring Boot Gateway to serve the built frontend, copy `frontend/dist/*` into `apigateway/src/main/resources/static/` (and remove/replace the existing static assets).

## Architecture (high level)
- `src/services/api.ts`: single Axios client with base URL + interceptors
- `src/contexts/AuthContext.tsx`: JWT storage + login/logout + role extraction
- `src/routes/ProtectedRoute.tsx`: authentication + role-based route guard
- `src/contexts/ToastContext.tsx`: global success/error feedback
- `src/pages/*`: feature pages (Login, Dashboard, Driver CRUD, GPS, Ticketing, Bus, Profile)

## Notes (auth & roles)
- All calls go **through the API Gateway** (dev proxy keeps same-origin semantics).
- The current backend JWT includes only `sub` (username) and no roles by default; the frontend supports roles if you later add them as JWT claims (`roles`, `role`, `authorities`, or `scope`).
- Example protected route: `/app/admin` requires role `admin` (handled in `src/routes/ProtectedRoute.tsx`).
