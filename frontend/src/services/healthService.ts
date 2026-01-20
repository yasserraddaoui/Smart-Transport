import { api } from "./api";

export type HealthStatus = "UP" | "DOWN" | "UNKNOWN";

export async function gatewayHealth(): Promise<HealthStatus> {
  try {
    const res = await api.get("/actuator/health");
    const status = (res.data as any)?.status;
    if (status === "UP" || status === "DOWN") return status;
    return "UNKNOWN";
  } catch {
    return "DOWN";
  }
}

