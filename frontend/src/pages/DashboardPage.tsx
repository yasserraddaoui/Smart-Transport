import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "../ui/primitives/PageHeader";
import Card from "../ui/primitives/Card";
import { getErrorMessage } from "../services/api";
import { useToast } from "../hooks/useToast";
import * as busService from "../services/busService";
import * as driverService from "../services/driverService";
import * as gpsService from "../services/gpsService";
import * as ticketingService from "../services/ticketingService";

export default function DashboardPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const [busMetrics, setBusMetrics] = useState<busService.BusMetrics | null>(null);
  const [driverMetrics, setDriverMetrics] = useState<driverService.DriverMetrics | null>(null);
  const [gpsMetrics, setGpsMetrics] = useState<gpsService.GpsMetrics | null>(null);
  const [sampleFare, setSampleFare] = useState<string | null>(null);

  const [latestBuses, setLatestBuses] = useState<busService.Bus[] | null>(null);
  const [latestDrivers, setLatestDrivers] = useState<driverService.Driver[] | null>(null);

  const kpis = useMemo(() => {
    return [
      {
        title: "Fleet Tunisie",
        value: busMetrics ? String(busMetrics.total) : "-",
        subtitle: busMetrics
          ? `${busMetrics.inService} en service, ${busMetrics.maintenance} en maintenance, ${busMetrics.outOfService} hors service`
          : "Bus actifs sur les reseaux tunisiens",
      },
      {
        title: "Chauffeurs",
        value: driverMetrics ? String(driverMetrics.total) : "-",
        subtitle: driverMetrics ? `${driverMetrics.active} actifs, ${driverMetrics.inactive} inactifs` : "Main d oeuvre",
      },
      {
        title: "Suivi GPS",
        value: gpsMetrics ? String(gpsMetrics.trackedBuses) : "-",
        subtitle: gpsMetrics ? `${gpsMetrics.totalLocations} positions collectees` : "Bus suivis en temps reel",
      },
      {
        title: "Tarif exemple",
        value: sampleFare ?? "-",
        subtitle: "Bab Saadoun -> La Marsa (TND)",
      },
    ];
  }, [busMetrics, driverMetrics, gpsMetrics, sampleFare]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bm, dm, gm] = await Promise.all([busService.metrics(), driverService.metrics(), gpsService.metrics()]);
      setBusMetrics(bm);
      setDriverMetrics(dm);
      setGpsMetrics(gm);

      const [buses, drivers] = await Promise.all([busService.list(), driverService.list()]);
      setLatestBuses(
        [...buses]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5),
      );
      setLatestDrivers(
        [...drivers]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5),
      );

      const fareXml = await ticketingService.calculatePrice({ departure: "Bab Saadoun", arrival: "La Marsa" });
      const match = fareXml.match(/<AmountTnd>([^<]+)<\/AmountTnd>/i);
      setSampleFare(match ? `${match[1]} TND` : "N/A");

      setLastUpdatedAt(new Date());
    } catch (e) {
      const msg = getErrorMessage(e);
      setError(msg);
      toast.error("Impossible de rafraichir", msg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <>
      <PageHeader
        title="Tableau de bord national"
        description="Synthese temps reel des bus, chauffeurs, GPS et tarification tunisienne."
      />

      <div className="grid4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} title={kpi.title} subtitle={kpi.subtitle} right={<span className="pill">{kpi.value}</span>}>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              {lastUpdatedAt ? `Maj: ${lastUpdatedAt.toLocaleString()}` : "Chargement..."}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 14 }} className="actions">
        <button className="btn btnSecondary" onClick={refresh} disabled={loading}>
          {loading ? "Actualisation..." : "Actualiser"}
        </button>
        {error ? <span style={{ color: "var(--danger)", fontSize: 13 }}>{error}</span> : null}
      </div>

      <div style={{ height: 14 }} />

      <div className="grid2">
        <Card title="Derniers bus" subtitle="Nouveaux enregistrements">
          {latestBuses === null ? (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Chargement...</div>
          ) : latestBuses.length === 0 ? (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Aucun bus trouve.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Numero</th>
                  <th>Ville</th>
                  <th>Ligne</th>
                </tr>
              </thead>
              <tbody>
                {latestBuses.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.busNumber}</td>
                    <td>{b.city}</td>
                    <td>{b.line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="Derniers chauffeurs" subtitle="Mises a jour recentes">
          {latestDrivers === null ? (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Chargement...</div>
          ) : latestDrivers.length === 0 ? (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Aucun chauffeur trouve.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Bus</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {latestDrivers.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.assignedBus}</td>
                    <td>{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  );
}
