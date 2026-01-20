import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import StatusPill from "../primitives/StatusPill";
import { useEffect, useMemo, useState } from "react";
import { gatewayHealth, HealthStatus } from "../../services/healthService";
import { useInterval } from "../../hooks/useInterval";
import "../../styles/app.css";

const navItems = [
  { to: "/app/dashboard", label: "Tableau de bord" },
  { to: "/app/bus", label: "Bus" },
  { to: "/app/driver", label: "Chauffeurs" },
  { to: "/app/gps", label: "GPS Tunisie" },
  { to: "/app/ticketing", label: "Billetterie" },
  { to: "/app/profile", label: "Profil" },
  { to: "/app/admin", label: "Administration" },
];

export default function AppShell() {
  const { user, logout, hasAnyRole } = useAuth();
  const location = useLocation();
  const [health, setHealth] = useState<HealthStatus>("UNKNOWN");

  const pageTitle = useMemo(() => {
    const hit = navItems.find((i) => location.pathname.startsWith(i.to));
    return hit?.label ?? "Smart Transport System - Tunisie";
  }, [location.pathname]);

  useEffect(() => {
    (async () => setHealth(await gatewayHealth()))();
  }, []);
  useInterval(() => {
    (async () => setHealth(await gatewayHealth()))();
  }, 15000);

  return (
    <div className="appShell">
      <aside className="sidebar" aria-label="Sidebar">
        <div className="brand">
          <div className="logo" aria-hidden="true">
            STS
          </div>
          <div>
            <div className="brandTitle">Smart Transport Tunisie</div>
            <div className="brandSub">Centre national des services</div>
          </div>
        </div>

        <nav className="nav">
          {navItems
            .filter((item) => (item.to === "/app/admin" ? hasAnyRole(["admin"]) : true))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `navLink ${isActive ? "navLinkActive" : ""}`}
              >
                <span>{item.label}</span>
                <span className="navBadge">API</span>
              </NavLink>
            ))}
        </nav>

        <div style={{ marginTop: 14 }} className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Session</div>
              <div className="cardSubtitle">{user?.subject ?? "Invite"}</div>
            </div>
            <StatusPill status={health} />
          </div>
          <div className="actions">
            <button className="btn btnSecondary" onClick={logout}>
              Se deconnecter
            </button>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar" aria-label="Topbar">
          <div className="topbarTitle">{pageTitle}</div>
          <div className="topbarRight">
            <span>API Gateway</span>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
