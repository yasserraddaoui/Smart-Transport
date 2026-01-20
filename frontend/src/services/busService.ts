import { api } from "./api";

export type BusStatus = "IN_SERVICE" | "MAINTENANCE" | "OUT_OF_SERVICE";

export type Bus = {
  id: number;
  busNumber: string;
  city: string;
  line: string;
  departure: string;
  arrival: string;
  company: string;
  capacity: number;
  status: BusStatus;
  createdAt: string;
};

export type BusPayload = {
  busNumber: string;
  city: string;
  line: string;
  departure: string;
  arrival: string;
  company: string;
  capacity: number;
  status: BusStatus;
};

export type BusMetrics = {
  total: number;
  inService: number;
  maintenance: number;
  outOfService: number;
};

export async function list(): Promise<Bus[]> {
  const res = await api.get<Bus[]>("/bus");
  return res.data;
}

export async function get(id: number): Promise<Bus> {
  const res = await api.get<Bus>(`/bus/${id}`);
  return res.data;
}

export async function create(payload: BusPayload): Promise<Bus> {
  const res = await api.post<Bus>("/bus", payload);
  return res.data;
}

export async function update(id: number, payload: BusPayload): Promise<Bus> {
  const res = await api.put<Bus>(`/bus/${id}`, payload);
  return res.data;
}

export async function remove(id: number): Promise<void> {
  await api.delete(`/bus/${id}`);
}

export async function metrics(): Promise<BusMetrics> {
  const res = await api.get<BusMetrics>("/bus/metrics");
  return res.data;
}
