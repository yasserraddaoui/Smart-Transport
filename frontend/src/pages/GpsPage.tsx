import { useEffect, useMemo, useState } from "react";
import PageHeader from "../ui/primitives/PageHeader";
import Card from "../ui/primitives/Card";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../services/api";
import * as gpsService from "../services/gpsService";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

const busIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function GpsPage() {
  const toast = useToast();
  const [locations, setLocations] = useState<gpsService.GpsLocation[] | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const center = useMemo<[number, number]>(() => [34.8, 9.5], []);

  async function refresh() {
    try {
      const data = await gpsService.listLocations();
      setLocations(data);
      setLastUpdatedAt(new Date());
    } catch (e) {
      toast.error("Erreur GPS", getErrorMessage(e));
    }
  }

  useEffect(() => {
    refresh();
    const handle = setInterval(refresh, 8000);
    return () => clearInterval(handle);
  }, []);

  return (
    <>
      <PageHeader
        title="Carte GPS Tunisie"
        description="Suivi temps reel des bus sur les routes tunisiennes (OpenStreetMap)."
      />

      <div className="grid2">
        <Card title="Carte interactive" subtitle="Tunis, Sfax, Sousse, Bizerte et plus">
          <div className="mapFrame">
            <MapContainer center={center} zoom={6.7} scrollWheelZoom className="mapCanvas">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locations?.map((loc) => (
                <Marker key={loc.busId} position={[loc.latitude, loc.longitude]} icon={busIcon}>
                  <Popup>
                    <div style={{ fontWeight: 600 }}>Bus #{loc.busId}</div>
                    <div>{loc.city}</div>
                    <div>{loc.speedKph} km/h</div>
                    <div>{new Date(loc.recordedAt).toLocaleTimeString()}</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Card>

        <Card title="Dernieres positions" subtitle="Bus suivis en direct">
          <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 10 }}>
            {lastUpdatedAt ? `Maj: ${lastUpdatedAt.toLocaleString()}` : "Chargement..."}
          </div>
          {locations === null ? (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Chargement...</div>
          ) : (
            <div className="listStack">
              {locations.map((loc) => (
                <div key={loc.busId} className="listItem">
                  <div>
                    <div className="listTitle">Bus #{loc.busId}</div>
                    <div className="listSubtitle">{loc.city}</div>
                  </div>
                  <div className="pill">{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
