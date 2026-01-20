import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { isInitialized } = useAuth();
  if (!isInitialized) return null;
  return <AppRoutes />;
}
