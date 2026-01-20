INSERT INTO tickets (id, passenger_name, bus_id, amount, status, created_at)
VALUES
  (1, 'Mohamed Ali', 1, 5.00, 'PAID', now() - interval '1 day'),
  (2, 'Ines Gharbi', 2, 3.50, 'PAID', now() - interval '6 hours'),
  (3, 'Khaled Jaziri', 1, 5.00, 'PENDING', now() - interval '10 minutes')
ON CONFLICT (id) DO NOTHING;

