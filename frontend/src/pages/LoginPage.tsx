import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../services/api";
import TextField from "../ui/primitives/TextField";
import Card from "../ui/primitives/Card";
import PageHeader from "../ui/primitives/PageHeader";
import "../styles/app.css";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin.tn");
  const [password, setPassword] = useState("Admin123!");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(() => username.trim().length > 0 && password.trim().length > 0, [username, password]);

  if (isAuthenticated) {
    navigate("/app", { replace: true });
    return null;
  }

  async function onSubmit() {
    if (!canSubmit || isLoading) return;
    setIsLoading(true);
    try {
      const response = await login(username, password);
      toast.success("Connexion reussie", "Bienvenue sur STS Tunisie.");
      const role = response.role?.toUpperCase() ?? "USER";
      if (role === "DRIVER") navigate("/app/driver", { replace: true });
      else if (role === "ADMIN") navigate("/app/dashboard", { replace: true });
      else navigate("/app/gps", { replace: true });
    } catch (e) {
      toast.error("Connexion echouee", getErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="centerPage">
      <div className="authCard">
        <PageHeader title="Smart Transport System - Tunisie" description="Connexion securisee via API Gateway (JWT)." />
        <Card title="Se connecter" subtitle="Utilise /auth/login">
          <div className="row">
            <TextField
              id="username"
              label="Nom d utilisateur"
              value={username}
              onChange={setUsername}
              placeholder="admin.tn"
            />
            <TextField
              id="password"
              label="Mot de passe"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="Admin123!"
            />
          </div>
          <div className="actions" style={{ marginTop: 12 }}>
            <button className="btn" onClick={onSubmit} disabled={!canSubmit || isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
          <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 12 }}>
            Comptes par defaut: admin.tn / Admin123!, driver.tn / Driver123!, user.tn / User123!
          </div>
        </Card>
      </div>
    </div>
  );
}
