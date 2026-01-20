const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "driverdb",
  user: process.env.DB_USER || "driveruser",
  password: process.env.DB_PASSWORD || "driverpass",
});

const seedDrivers = [
  {
    name: "Hatem Ben Salah",
    phone: "+216 22 456 789",
    licenseNumber: "TN-DRV-1001",
    assignedBus: "BUS-TN-001",
    status: "ACTIVE",
  },
  {
    name: "Rim Cherif",
    phone: "+216 55 812 410",
    licenseNumber: "TN-DRV-1002",
    assignedBus: "BUS-TN-002",
    status: "ACTIVE",
  },
  {
    name: "Khaled Gharbi",
    phone: "+216 98 334 221",
    licenseNumber: "TN-DRV-1003",
    assignedBus: "BUS-TN-003",
    status: "INACTIVE",
  },
];

function mapRow(row) {
  return {
    id: row.id,
    name: row.full_name,
    phone: row.phone,
    licenseNumber: row.license_number,
    assignedBus: row.assigned_bus,
    status: row.status,
    createdAt: row.created_at,
  };
}

function validateDriver(payload) {
  const errors = [];
  if (!payload.name || String(payload.name).trim() === "") errors.push("name is required");
  if (!payload.phone || String(payload.phone).trim() === "") errors.push("phone is required");
  if (payload.phone && !String(payload.phone).startsWith("+216")) errors.push("phone must start with +216");
  if (!payload.licenseNumber || String(payload.licenseNumber).trim() === "") errors.push("licenseNumber is required");
  if (!payload.assignedBus || String(payload.assignedBus).trim() === "") errors.push("assignedBus is required");
  if (!payload.status || String(payload.status).trim() === "") errors.push("status is required");
  const allowed = new Set(["ACTIVE", "INACTIVE"]);
  if (payload.status && !allowed.has(String(payload.status))) errors.push("status must be ACTIVE or INACTIVE");
  return errors;
}

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS drivers (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      license_number TEXT NOT NULL UNIQUE,
      assigned_bus TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  for (const driver of seedDrivers) {
    await pool.query(
      `
        INSERT INTO drivers (full_name, phone, license_number, assigned_bus, status)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (license_number) DO NOTHING;
      `,
      [driver.name, driver.phone, driver.licenseNumber, driver.assignedBus, driver.status],
    );
  }
}

app.get("/driver/metrics", async (req, res, next) => {
  try {
    const total = await pool.query("SELECT COUNT(*)::int AS total FROM drivers");
    const active = await pool.query("SELECT COUNT(*)::int AS total FROM drivers WHERE status = 'ACTIVE'");
    const inactive = await pool.query("SELECT COUNT(*)::int AS total FROM drivers WHERE status = 'INACTIVE'");
    res.json({
      total: total.rows[0].total,
      active: active.rows[0].total,
      inactive: inactive.rows[0].total,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/driver", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM drivers ORDER BY id ASC");
    res.json(result.rows.map(mapRow));
  } catch (err) {
    next(err);
  }
});

app.get("/driver/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM drivers WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Driver not found" });
    res.json(mapRow(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

app.post("/driver", async (req, res, next) => {
  try {
    const errors = validateDriver(req.body || {});
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });

    const { name, phone, licenseNumber, assignedBus, status } = req.body;
    const result = await pool.query(
      `
        INSERT INTO drivers (full_name, phone, license_number, assigned_bus, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `,
      [name, phone, licenseNumber, assignedBus, status],
    );
    res.status(201).json(mapRow(result.rows[0]));
  } catch (err) {
    if (String(err.message || "").includes("drivers_license_number_key")) {
      return res.status(400).json({ message: "licenseNumber already exists" });
    }
    next(err);
  }
});

app.put("/driver/:id", async (req, res, next) => {
  try {
    const errors = validateDriver(req.body || {});
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });

    const { name, phone, licenseNumber, assignedBus, status } = req.body;
    const result = await pool.query(
      `
        UPDATE drivers
        SET full_name = $1,
            phone = $2,
            license_number = $3,
            assigned_bus = $4,
            status = $5
        WHERE id = $6
        RETURNING *;
      `,
      [name, phone, licenseNumber, assignedBus, status, req.params.id],
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Driver not found" });
    res.json(mapRow(result.rows[0]));
  } catch (err) {
    if (String(err.message || "").includes("drivers_license_number_key")) {
      return res.status(400).json({ message: "licenseNumber already exists" });
    }
    next(err);
  }
});

app.delete("/driver/:id", async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM drivers WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: "Driver not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

app.get("/driver/health", (req, res) => {
  res.json({ status: "ok", service: "driver-service" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const port = Number(process.env.PORT || 8083);

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Driver service running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to init driver service", err);
    process.exit(1);
  });
