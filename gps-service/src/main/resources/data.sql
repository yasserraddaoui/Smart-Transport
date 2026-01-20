INSERT INTO gps_locations (id, bus_id, latitude, longitude, recorded_at)
VALUES
  (1, 1, 36.8065, 10.1815, now() - interval '5 minutes'),
  (2, 1, 36.8071, 10.1822, now() - interval '2 minutes'),
  (3, 2, 36.8001, 10.1702, now() - interval '3 minutes')
ON CONFLICT (id) DO NOTHING;

