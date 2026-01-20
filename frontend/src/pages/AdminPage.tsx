import PageHeader from "../ui/primitives/PageHeader";
import Card from "../ui/primitives/Card";

export default function AdminPage() {
  return (
    <>
      <PageHeader title="Administration" description="Acces reserve aux roles ADMIN du transport tunisien." />
      <Card title="Zone admin" subtitle="Protection JWT via roles">
        <div style={{ color: "var(--muted)", fontSize: 13 }}>
          Cette page est visible uniquement si le JWT contient le role <code>ADMIN</code>.
        </div>
      </Card>
    </>
  );
}
