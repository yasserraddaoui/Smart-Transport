import { useEffect, useState } from "react";
import PageHeader from "../ui/primitives/PageHeader";
import Card from "../ui/primitives/Card";
import TextField from "../ui/primitives/TextField";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../services/api";
import * as authService from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<authService.UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await authService.me();
        setProfile(me);
        setFullName(me.fullName);
        setCity(me.city);
      } catch (e) {
        toast.error("Erreur", getErrorMessage(e));
      }
    })();
  }, [toast]);

  async function copyToken() {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      toast.success("Copie OK", "Token JWT copie.");
    } catch {
      toast.error("Copie impossible", "Acces au presse-papiers refuse.");
    }
  }

  async function saveProfile() {
    if (!profile) return;
    try {
      const updated = await authService.updateUser(profile.id, { fullName, city, password: password || undefined });
      setProfile(updated);
      setPassword("");
      toast.success("Profil mis a jour", "Vos informations ont ete mises a jour.");
    } catch (e) {
      toast.error("Erreur", getErrorMessage(e));
    }
  }

  async function deleteAccount() {
    if (!profile) return;
    if (!window.confirm("Confirmer la suppression du compte ?")) return;
    try {
      await authService.deleteUser(profile.id);
      logout();
      navigate("/login", { replace: true });
    } catch (e) {
      toast.error("Erreur", getErrorMessage(e));
    }
  }

  return (
    <>
      <PageHeader title="Profil" description="Informations de session JWT et gestion de compte." />

      <div className="grid2">
        <Card title="Utilisateur" subtitle="Extrait du JWT">
          <table className="table">
            <tbody>
              <tr>
                <th>Utilisateur</th>
                <td>{user?.subject ?? "-"}</td>
              </tr>
              <tr>
                <th>Roles</th>
                <td>{user?.roles?.join(", ") ?? "-"}</td>
              </tr>
              <tr>
                <th>Emis</th>
                <td>{user?.issuedAt ? new Date(user.issuedAt * 1000).toLocaleString() : "-"}</td>
              </tr>
              <tr>
                <th>Expire</th>
                <td>{user?.expiresAt ? new Date(user.expiresAt * 1000).toLocaleString() : "-"}</td>
              </tr>
            </tbody>
          </table>
          <div className="actions" style={{ marginTop: 12 }}>
            <button className="btn btnSecondary" onClick={copyToken} disabled={!token}>
              Copier le token
            </button>
          </div>
        </Card>

        <Card title="Mettre a jour" subtitle="Nom, ville et mot de passe">
          <div className="row">
            <TextField id="fullName" label="Nom complet" value={fullName} onChange={setFullName} />
            <TextField id="city" label="Ville" value={city} onChange={setCity} />
          </div>
          <div className="row">
            <TextField
              id="password"
              label="Nouveau mot de passe"
              value={password}
              onChange={setPassword}
              type="password"
            />
          </div>
          <div className="actions" style={{ marginTop: 12 }}>
            <button className="btn" onClick={saveProfile} disabled={!profile}>
              Enregistrer
            </button>
            <button className="btn btnDanger" onClick={deleteAccount} disabled={!profile}>
              Supprimer le compte
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
