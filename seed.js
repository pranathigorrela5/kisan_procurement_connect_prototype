const db = require('./database');

function seedDatabase() {
  console.log('Seeding database with SIH Demo Data...');

  // 1. Clear existing table contents for clean demo state
  db.exec('DELETE FROM payments;');
  db.exec('DELETE FROM weighments;');
  db.exec('DELETE FROM quality_inspections;');
  db.exec('DELETE FROM bookings;');
  db.exec('DELETE FROM slots;');
  db.exec('DELETE FROM crops;');
  db.exec('DELETE FROM centres;');
  db.exec('DELETE FROM users;');

  // Reset sqlite_sequence if present
  try {
    db.exec("DELETE FROM sqlite_sequence WHERE name IN ('users', 'centres', 'crops', 'slots', 'quality_inspections', 'weighments', 'payments');");
  } catch (e) {}

  // 2. Insert Users
  const stmtUser = db.prepare('INSERT INTO users (name, phone, role, district, state) VALUES (?, ?, ?, ?, ?)');
  stmtUser.run('Ramesh Kumar', '9876543210', 'FARMER', 'Guntur', 'Andhra Pradesh');
  stmtUser.run('Suresh Patel', '9876543211', 'FARMER', 'Guntur', 'Andhra Pradesh');
  stmtUser.run('Lakshmi Devi', '9876543212', 'FARMER', 'Warangal', 'Telangana');
  stmtUser.run('Venkat Rao', '9876543213', 'FARMER', 'Guntur', 'Andhra Pradesh');
  stmtUser.run('Anil Verma', '9876543214', 'FARMER', 'Karnal', 'Haryana');
  stmtUser.run('Officer Admin', '9999999999', 'ADMIN', 'Guntur', 'Andhra Pradesh');

  // 3. Insert Centres
  const stmtCentre = db.prepare('INSERT INTO centres (name, code, district, state, capacity_qtl) VALUES (?, ?, ?, ?, ?)');
  stmtCentre.run('Guntur Main APMC Mandi', 'AP-GNT-01', 'Guntur', 'Andhra Pradesh', 1000);
  stmtCentre.run('Warangal Central Grain Hub', 'TS-WGL-02', 'Warangal', 'Telangana', 800);
  stmtCentre.run('Karnal Model Procurement Centre', 'HR-KRN-03', 'Karnal', 'Haryana', 1200);

  // 4. Insert Crops with Official MSP Rates
  const stmtCrop = db.prepare('INSERT INTO crops (name, category, msp_rate_per_qtl) VALUES (?, ?, ?)');
  stmtCrop.run('Paddy (Common)', 'Cereal', 2300);
  stmtCrop.run('Paddy (Grade A)', 'Cereal', 2320);
  stmtCrop.run('Wheat', 'Cereal', 2425);
  stmtCrop.run('Maize', 'Coarse Grain', 2225);
  stmtCrop.run('Cotton (Medium Staple)', 'Fiber', 7121);

  // 5. Insert Slots for Today
  const today = new Date().toISOString().split('T')[0];
  const stmtSlot = db.prepare('INSERT INTO slots (centre_id, slot_date, time_window, max_capacity, booked_count) VALUES (?, ?, ?, ?, ?)');
  stmtSlot.run(1, today, '08:00 AM - 10:00 AM', 30, 5);
  stmtSlot.run(1, today, '10:00 AM - 12:00 PM', 30, 8);
  stmtSlot.run(1, today, '12:00 PM - 02:00 PM', 30, 2);
  stmtSlot.run(1, today, '02:00 PM - 04:00 PM', 30, 0);

  stmtSlot.run(2, today, '09:00 AM - 11:00 AM', 25, 4);
  stmtSlot.run(2, today, '11:00 AM - 01:00 PM', 25, 3);

  // 6. Insert Sample Bookings across workflow stages
  const stmtBooking = db.prepare(`
    INSERT INTO bookings (
      id, farmer_id, farmer_name, farmer_phone, centre_id, centre_name,
      crop_id, crop_name, msp_rate, slot_id, booking_date, time_window,
      estimated_qtl, status, token_number, arrived_at, quality_checked_at, weighed_at, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();

  // Booking 1: Freshly Booked
  stmtBooking.run(
    'BK-1001', 1, 'Ramesh Kumar', '9876543210', 1, 'Guntur Main APMC Mandi',
    1, 'Paddy (Common)', 2300, 1, today, '08:00 AM - 10:00 AM',
    45.0, 'BOOKED', 'Q-101', null, null, null, null
  );

  // Booking 2: Arrived at Gate (Gatekeeper checked in)
  stmtBooking.run(
    'BK-1002', 2, 'Suresh Patel', '9876543211', 1, 'Guntur Main APMC Mandi',
    2, 'Paddy (Grade A)', 2320, 1, today, '08:00 AM - 10:00 AM',
    60.0, 'ARRIVED', 'Q-102', now, null, null, null
  );

  // Booking 3: Quality Passed (Inspector evaluated)
  stmtBooking.run(
    'BK-1003', 3, 'Lakshmi Devi', '9876543212', 1, 'Guntur Main APMC Mandi',
    1, 'Paddy (Common)', 2300, 2, today, '10:00 AM - 12:00 PM',
    35.0, 'QUALITY_PASSED', 'Q-103', now, now, null, null
  );
  db.prepare('INSERT INTO quality_inspections (booking_id, moisture_pct, foreign_matter_pct, grade, status, notes) VALUES (?, ?, ?, ?, ?, ?)')
    .run('BK-1003', 12.5, 0.8, 'Grade A', 'PASSED', 'Grain moisture within optimal 13% threshold.');

  // Booking 4: Weighed (Weighbridge completed)
  stmtBooking.run(
    'BK-1004', 4, 'Venkat Rao', '9876543213', 1, 'Guntur Main APMC Mandi',
    3, 'Wheat', 2425, 2, today, '10:00 AM - 12:00 PM',
    50.0, 'WEIGHED', 'Q-104', now, now, now, null
  );
  db.prepare('INSERT INTO quality_inspections (booking_id, moisture_pct, foreign_matter_pct, grade, status, notes) VALUES (?, ?, ?, ?, ?, ?)')
    .run('BK-1004', 11.8, 0.5, 'Grade A', 'PASSED', 'Excellent quality wheat batch.');
  db.prepare('INSERT INTO weighments (booking_id, gross_weight_kg, tare_weight_kg, net_weight_kg, net_weight_qtl) VALUES (?, ?, ?, ?, ?)')
    .run('BK-1004', 6200, 1200, 5000, 50.0);

  // Booking 5: Fully Completed & Paid
  stmtBooking.run(
    'BK-1005', 5, 'Anil Verma', '9876543214', 1, 'Guntur Main APMC Mandi',
    1, 'Paddy (Common)', 2300, 1, today, '08:00 AM - 10:00 AM',
    40.0, 'PAYMENT_PROCESSED', 'Q-105', now, now, now, now
  );
  db.prepare('INSERT INTO quality_inspections (booking_id, moisture_pct, foreign_matter_pct, grade, status, notes) VALUES (?, ?, ?, ?, ?, ?)')
    .run('BK-1005', 12.0, 1.0, 'Grade A', 'PASSED', 'Standard procurement batch.');
  db.prepare('INSERT INTO weighments (booking_id, gross_weight_kg, tare_weight_kg, net_weight_kg, net_weight_qtl) VALUES (?, ?, ?, ?, ?)')
    .run('BK-1005', 5400, 1400, 4000, 40.0);
  db.prepare('INSERT INTO payments (booking_id, total_qtl, msp_rate, gross_amount, net_amount, bank_ref, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run('BK-1005', 40.0, 2300, 92000, 92000, 'DBT-2026-9920148', 'PROCESSED');

  console.log('Database Seeding Complete!');
}

seedDatabase();
