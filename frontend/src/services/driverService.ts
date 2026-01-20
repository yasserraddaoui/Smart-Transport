import { api } from "./api";

export type DriverStatus = "ACTIVE" | "INACTIVE";

export type Driver = {
  id: number;
  name: string;
  phone: string;
  licenseNumber: string;
  assignedBus: string;
  status: DriverStatus;
  createdAt: string;
};

export type DriverPayload = {
  name: string;
  phone: string;
  licenseNumber: string;
  assignedBus: string;
  status: DriverStatus;
};

export type DriverMetrics = {
  total: number;
  active: number;
  inactive: number;
};

export async function list(): Promise<Driver[]> {
  const res = await api.get<Driver[]>("/driver");
  return res.data;
}

export async function get(id: number): Promise<Driver> {
  const res = await api.get<Driver>(`/driver/${id}`);
  return res.data;
}

export async function create(payload: DriverPayload): Promise<Driver> {
  const res = await api.post<Driver>("/driver", payload);
  return res.data;
}

export async function update(id: number, payload: DriverPayload): Promise<Driver> {
  const res = await api.put<Driver>(`/driver/${id}`, payload);
  return res.data;
}

export async function remove(id: number): Promise<void> {
  await api.delete(`/driver/${id}`);
}

export async function metrics(): Promise<DriverMetrics> {
  const res = await api.get<DriverMetrics>("/driver/metrics");
  return res.data;
}
