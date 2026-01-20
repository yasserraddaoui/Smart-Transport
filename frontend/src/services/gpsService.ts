import { api } from "./api";

export type GpsLocation = {
  busId: number;
  city: string;
  latitude: number;
  longitude: number;
  speedKph: number;
  heading: number;
  recordedAt: string;
};

export type GpsMetrics = {
  trackedBuses: number;
  totalLocations: number;
};

export async function listLocations(): Promise<GpsLocation[]> {
  const res = await api.get<GpsLocation[]>("/gps/locations");
  return res.data;
}

export async function getBusLocation(busId: number): Promise<GpsLocation> {
  const res = await api.get<GpsLocation>(`/gps/bus/${busId}`);
  return res.data;
}

export async function metrics(): Promise<GpsMetrics> {
  const res = await api.get<GpsMetrics>("/gps/metrics");
  return res.data;
}

export async function hello(): Promise<string> {
  const res = await api.get<string>("/gps/hello", { responseType: "text" });
  return typeof res.data === "string" ? res.data : String(res.data);
}
