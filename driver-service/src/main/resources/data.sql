INSERT INTO drivers (id, full_name, phone, license_number, status, created_at)
VALUES
  (1, 'Ahmed Ben Salah', '+216 20 123 456', 'TN-LIC-1001', 'ACTIVE', now()),
  (2, 'Sarra Trabelsi', '+216 22 555 777', 'TN-LIC-1002', 'ACTIVE', now()),
  (3, 'Youssef Mansour', '+216 98 111 222', 'TN-LIC-1003', 'INACTIVE', now())
ON CONFLICT (id) DO NOTHING;

