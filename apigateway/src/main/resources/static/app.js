const TOKEN_KEY = "sts_token";

const out = document.getElementById("out");
const tokenMeta = document.getElementById("tokenMeta");
const tokenState = document.getElementById("tokenState");
const healthEl = document.getElementById("health");
const lastStatus = document.getElementById("lastStatus");
const lastPath = document.getElementById("lastPath");
const gpsParsed = document.getElementById("gpsParsed");

function setOut(text) {
  out.textContent = text ?? "";
}

function setHealth(state) {
  healthEl.textContent = state.label;
  healthEl.classList.remove("ok", "bad");
  if (state.kind === "ok") healthEl.classList.add("ok");
  if (state.kind === "bad") healthEl.classList.add("bad");
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function setToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    localStorage.setItem(TOKEN_KEY, token);
  }
  renderToken();
}

function renderToken() {
  const token = getToken();
  const connected = Boolean(token);
  tokenState.textContent = connected ? "Connecté" : "Non connecté";
  tokenMeta.textContent = connected ? `Token enregistré (${token.length} caractères)` : "";
}

function setLastCall({ status, path }) {
  lastStatus.textContent = status ?? "—";
  lastPath.textContent = path ?? "";
}

function showView(view) {
  document.querySelectorAll(".view").forEach((el) => {
    const match = el.getAttribute("data-view") === view;
    el.classList.toggle("hidden", !match);
  });

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-view") === view);
  });
}

async function request({ method, path, body, withAuth }) {
  const headers = {};
  if (body != null) headers["Content-Type"] = "application/json";
  if (withAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const text = contentType.includes("application/json")
    ? JSON.stringify(await res.json(), null, 2)
    : await res.text();

  return { status: res.status, text };
}

async function callEndpoint({ method, path, noAuth }) {
  try {
    const withAuth = !noAuth;
    const { status, text } = await request({ method, path, withAuth });
    setLastCall({ status: String(status), path: `${method} ${path}` });
    setOut(`[${status}] ${text}`);

    if (path === "/gps/location") {
      parseGps(text);
    }
  } catch (e) {
    setLastCall({ status: "ERR", path: `${method} ${path}` });
    setOut(String(e));
  }
}

function parseGps(text) {
  const match = /Lat:\s*([0-9.+-]+),\s*Lon:\s*([0-9.+-]+)/i.exec(text || "");
  if (!match) {
    gpsParsed.textContent = "";
    return;
  }
  const lat = Number(match[1]);
  const lon = Number(match[2]);
  gpsParsed.textContent = Number.isFinite(lat) && Number.isFinite(lon) ? `Lat: ${lat} | Lon: ${lon}` : "";
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    const { status, text } = await request({
      method: "POST",
      path: "/auth/login",
      body: { username, password },
      withAuth: false,
    });
    setLastCall({ status: String(status), path: "POST /auth/login" });
    setToken(text.trim());
    setOut(text);
  } catch (e) {
    setOut(String(e));
  }
}

async function refreshHealth() {
  try {
    const { status, text } = await request({
      method: "GET",
      path: "/actuator/health",
      withAuth: false,
    });
    const ok = status >= 200 && status < 300 && /\"status\"\s*:\s*\"UP\"/i.test(text);
    setHealth({ kind: ok ? "ok" : "bad", label: ok ? "UP" : "DOWN" });
  } catch {
    setHealth({ kind: "bad", label: "DOWN" });
  }
}

function wireUi() {
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => showView(btn.getAttribute("data-view")));
  });

  document.querySelectorAll(".action").forEach((btn) => {
    btn.addEventListener("click", () => {
      callEndpoint({
        method: btn.getAttribute("data-method") || "GET",
        path: btn.getAttribute("data-path") || "/",
        noAuth: btn.getAttribute("data-noauth") === "true",
      });
    });
  });

  document.getElementById("loginBtn").addEventListener("click", login);
  document.getElementById("logoutBtn").addEventListener("click", () => {
    setToken("");
    setOut("Déconnecté");
  });
  document.getElementById("copyTokenBtn").addEventListener("click", async () => {
    const token = getToken();
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setOut("Token copié dans le presse-papiers.");
    } catch {
      setOut("Impossible de copier le token (permissions navigateur).");
    }
  });

  document.getElementById("clearBtn").addEventListener("click", () => {
    setOut("");
    gpsParsed.textContent = "";
  });

  document.getElementById("driverGetBtn").addEventListener("click", () => {
    const id = document.getElementById("driverId").value || "";
    callEndpoint({ method: "GET", path: `/driver/${id}` });
  });
  document.getElementById("driverPutBtn").addEventListener("click", () => {
    const id = document.getElementById("driverId").value || "";
    callEndpoint({ method: "PUT", path: `/driver/${id}` });
  });
  document.getElementById("driverDelBtn").addEventListener("click", () => {
    const id = document.getElementById("driverId").value || "";
    callEndpoint({ method: "DELETE", path: `/driver/${id}` });
  });
}

function init() {
  renderToken();
  setHealth({ kind: "", label: "…" });
  wireUi();
  refreshHealth();
  setInterval(refreshHealth, 15000);
  showView("overview");
}

init();

