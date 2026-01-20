import { HealthStatus } from "../../services/healthService";

export default function StatusPill({ status }: { status: HealthStatus }) {
  const label = status === "UNKNOWN" ? "UNKNOWN" : status;
  const dotClass =
    status === "UP" ? "dot dotOk" : status === "DOWN" ? "dot dotBad" : "dot dotWarn";

  return (
    <span className="pill" title={`Gateway: ${label}`}>
      <span className={dotClass} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

