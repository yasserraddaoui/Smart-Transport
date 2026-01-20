import { Link } from "react-router-dom";
import PageHeader from "../ui/primitives/PageHeader";
import Card from "../ui/primitives/Card";

export default function NotFoundPage() {
  return (
    <div className="centerPage">
      <div style={{ width: "min(720px, 100%)" }}>
        <PageHeader title="Page introuvable" description="La route demandee n existe pas." />
        <Card title="404" subtitle="Page non trouvee">
          <div className="actions">
            <Link className="btn" to="/app/dashboard">
              Retour au tableau de bord
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
