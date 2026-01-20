import { useEffect, useMemo, useState } from "react";
import PageHeader from "../ui/primitives/PageHeader";
import Card from "../ui/primitives/Card";
import TextField from "../ui/primitives/TextField";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../services/api";
import * as busService from "../services/busService";

const cities = ["Tunis", "Sfax", "Sousse", "Bizerte", "Nabeul", "Monastir", "Kairouan", "Gabes", "Gafsa"];
const companies = ["TRANSTU", "SNCFT", "Bus regional"];

export default function BusPage() {
  const toast = useToast();
  const [buses, setBuses] = useState<busService.Bus[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<busService.BusPayload>({
    busNumber: "BUS-TN-010",
    city: "Tunis",
    line: "Ligne TGM",
    departure: "Bab Saadoun",
    arrival: "La Marsa",
    company: "TRANSTU",
    capacity: 40,
    status: "IN_SERVICE",
  });

  const canSubmit = useMemo(() => {
    return form.capacity > 0 && Object.values(form).every((v) => String(v).trim().length > 0);
  }, [form]);

  async function refresh() {
    setIsLoading(true);
    try {
      setBuses(await busService.list());
    } catch (e) {
      toast.error("Erreur", getErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createBus() {
    if (!canSubmit) return;
    try {
      await busService.create(form);
      toast.success("Bus cree", "Le bus tunisien a ete ajoute.");
      await refresh();
    } catch (e) {
      toast.error("Erreur", getErrorMessage(e));
    }
  }

  return (
    <>
      <PageHeader title="Gestion des bus" description="Enregistrer les lignes tunisiennes et suivre les capacites." />

      <div className="grid2">
        <Card title="Nouveau bus" subtitle="TRANSTU, SNCFT, bus regionaux">
          <div className="row">
            <TextField
              id="busNumber"
              label="Numero"
              value={form.busNumber}
              onChange={(value) => setForm((prev) => ({ ...prev, busNumber: value }))}
              placeholder="BUS-TN-001"
            />
            <TextField
              id="line"
              label="Ligne"
              value={form.line}
              onChange={(value) => setForm((prev) => ({ ...prev, line: value }))}
              placeholder="Ligne 5"
            />
          </div>
          <div className="row">
            <TextField
              id="city"
              label="Ville"
              value={form.city}
              onChange={(value) => setForm((prev) => ({ ...prev, city: value }))}
              placeholder="Tunis"
              listId="busCities"
            />
            <datalist id="busCities">
              {cities.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
            <TextField
              id="company"
              label="Compagnie"
              value={form.company}
              onChange={(value) => setForm((prev) => ({ ...prev, company: value }))}
              placeholder="TRANSTU"
              listId="busCompanies"
            />
            <datalist id="busCompanies">
              {companies.map((company) => (
                <option key={company} value={company} />
              ))}
            </datalist>
          </div>
          <div className="row">
            <TextField
              id="departure"
              label="Depart"
              value={form.departure}
              onChange={(value) => setForm((prev) => ({ ...prev, departure: value }))}
              placeholder="Bab Saadoun"
            />
            <TextField
              id="arrival"
              label="Arrivee"
              value={form.arrival}
              onChange={(value) => setForm((prev) => ({ ...prev, arrival: value }))}
              placeholder="La Marsa"
            />
          </div>
          <div className="row">
            <TextField
              id="capacity"
              label="Capacite"
              value={String(form.capacity)}
              onChange={(value) => setForm((prev) => ({ ...prev, capacity: Number(value) || 0 }))}
              placeholder="45"
              type="number"
            />
            <TextField
              id="status"
              label="Statut"
              value={form.status}
              onChange={(value) => setForm((prev) => ({ ...prev, status: value as busService.BusStatus }))}
              placeholder="IN_SERVICE"
              listId="busStatus"
            />
            <datalist id="busStatus">
              <option value="IN_SERVICE" />
              <option value="MAINTENANCE" />
              <option value="OUT_OF_SERVICE" />
            </datalist>
          </div>
          <div className="actions" style={{ marginTop: 12 }}>
            <button className="btn" onClick={createBus} disabled={!canSubmit}>
              Enregistrer
            </button>
          </div>
        </Card>

        <Card title="Flotte tunisienne" subtitle="Liste des bus enregistres">
          {isLoading ? (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Chargement...</div>
          ) : buses === null ? (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Aucune donnees.</div>
          ) : (
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Numero</th>
                    <th>Ville</th>
                    <th>Ligne</th>
                    <th>Depart</th>
                    <th>Arrivee</th>
                    <th>Compagnie</th>
                    <th>Capacite</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus) => (
                    <tr key={bus.id}>
                      <td>{bus.busNumber}</td>
                      <td>{bus.city}</td>
                      <td>{bus.line}</td>
                      <td>{bus.departure}</td>
                      <td>{bus.arrival}</td>
                      <td>{bus.company}</td>
                      <td>{bus.capacity}</td>
                      <td>{bus.status}</td>
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
