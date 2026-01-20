INSERT INTO buses (id, bus_number, city, line_name, departure, arrival, company, capacity, status, created_at)
VALUES
  (1, 'BUS-TN-001', 'Tunis', 'Ligne TGM', 'Bab Saadoun', 'La Marsa', 'TRANSTU', 45, 'IN_SERVICE', now()),
  (2, 'BUS-TN-002', 'Tunis', 'Ligne 5', 'Tunis', 'Ariana', 'TRANSTU', 40, 'IN_SERVICE', now()),
  (3, 'BUS-TN-003', 'Sfax', 'Ligne S1', 'Sfax', 'Mahdia', 'Bus regional', 50, 'IN_SERVICE', now()),
  (4, 'BUS-TN-004', 'Sousse', 'Ligne 12', 'Sousse', 'Monastir', 'Bus regional', 42, 'MAINTENANCE', now()),
  (5, 'BUS-TN-005', 'Bizerte', 'Ligne B1', 'Bizerte', 'Nabeul', 'SNCFT', 48, 'OUT_OF_SERVICE', now())
ON CONFLICT (id) DO NOTHING;
