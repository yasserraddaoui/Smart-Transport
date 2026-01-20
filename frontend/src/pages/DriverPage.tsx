import { useEffect, useMemo, useState } from "react";
import PageHeader from "../ui/primitives/PageHeader";
import Card from "../ui/primitives/Card";
import TextField from "../ui/primitives/TextField";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../services/api";
import * as driverService from "../services/driverService";

export default function DriverPage() {
  const toast = useToast();
  const [drivers, setDrivers] = useState<driverService.Driver[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<driverService.DriverPayload>({
    name: "Hatem Ben Salah",
    phone: "+216 22 456 789",
    licenseNumber: "TN-DRV-2001",
    assignedBus: "BUS-TN-001",
    status: "ACTIVE",
  });

  const canSubmit = useMemo(() => {
    return Object.values(form).every((v) => String(v).trim().length > 0);
  }, [form]);

  async function refresh() {
    setIsLoading(true);
    try {
      setDrivers(await driverService.list());
    } catch (e) {
      toast.error("Erreur", getErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createDriver() {
    if (!canSubmit) return;
    try {
      await driverService.create(form);
      toast.success("Chauffeur cree", "Le chauffeur tunisien a ete ajoute.");
      await refresh();
    } catch (e) {
      toast.error("Erreur", getErrorMessage(e));
    }
  }

  return (
    <>
      <PageHeader title="Gestion des chauffeurs" description="Suivi des chauffeurs tunisiens et affectations bus." />

      <div className="grid2">
        <Card title="Nouveau chauffeur" subtitle="Permis tunisiens et bus assignes">
          <div className="row">
            <TextField
              id="driverName"
              label="Nom complet"
              value={form.name}
              onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
              placeholder="Hatem Ben Salah"
            />
            <TextField
              id="driverPhone"
              label="Telephone"
              value={form.phone}
              onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
              placeholder="+216 22 456 789"
            />
          </div>
          <div className="row">
            <TextField
              id="driverLicense"
              label="Permis"
              value={form.licenseNumber}
              onChange={(value) => setForm((prev) => ({ ...prev, licenseNumber: value }))}
              placeholder="TN-DRV-2001"
            />
            <TextField
              id="assignedBus"
              label="Bus assigne"
              value={form.assignedBus}
              onChange={(value) => setForm((prev) => ({ ...prev, assignedBus: value }))}
              placeholder="BUS-TN-001"
            />
          </div>
          <div className="row">
            <TextField
              id="driverStatus"
              label="Statut"
              value={form.status}
              onChange={(value) => setForm((prev) => ({ ...prev, status: value as driverService.DriverStatus }))}
              placeholder="ACTIVE"
              listId="driverStatus"
            />
            <datalist id="driverStatus">
              <option value="ACTIVE" />
              <option value="INACTIVE" />
            </datalist>
          </div>
          <div className="actions" style={{ marginTop: 12 }}>
            <button className="btn" onClick={createDriver} disabled={!canSubmit}>
              Ajouter
            </button>
          </div>
        </Card>

        <Card title="Equipe de conduite" subtitle="Chauffeurs enregistres">
          {isLoading ? (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Chargement...</div>
          ) : drivers === null ? (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Aucune donnees.</div>
          ) : (
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Telephone</th>
                    <th>Permis</th>
                    <th>Bus</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id}>
                      <td>{driver.name}</td>
                      <td>{driver.phone}</td>
                      <td>{driver.licenseNumber}</td>
                      <td>{driver.assignedBus}</td>
                      <td>{driver.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
