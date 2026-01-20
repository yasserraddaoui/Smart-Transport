import { Link } from "react-router-dom";
import PageHeader from "../ui/primitives/PageHeader";
import Card from "../ui/primitives/Card";

export default function ForbiddenPage() {
  return (
    <div className="centerPage">
      <div style={{ width: "min(720px, 100%)" }}>
        <PageHeader title="Acces refuse" description="Vous n avez pas les droits necessaires." />
        <Card title="403" subtitle="Acces interdit">
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Verifiez votre role JWT ou reconnectez-vous avec un compte autorise.
          </div>
          <div className="actions" style={{ marginTop: 12 }}>
            <Link className="btn btnSecondary" to="/app/dashboard">
              Retour au tableau de bord
            </Link>
            <Link className="btn" to="/login">
              Connexion
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
