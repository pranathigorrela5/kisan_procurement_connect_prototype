const db = require('./database');

function seedDatabase() {
  console.log('Seeding database with SIH Andhra Pradesh Demo Data...');

  // 1. Clear existing table contents for clean demo state
  try { db.exec('DELETE FROM sms_messages;'); } catch (e) {}
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
    db.exec("DELETE FROM sqlite_sequence WHERE name IN ('users', 'centres', 'crops', 'slots', 'quality_inspections', 'weighments', 'payments', 'sms_messages');");
  } catch (e) {}

  // 2. Insert Users (Aadhaar linked farmers)
  const stmtUser = db.prepare('INSERT INTO users (name, phone, role, district, state, aadhaar, land_record_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
  stmtUser.run('Ramesh Kumar', '9876543210', 'FARMER', 'Guntur', 'Andhra Pradesh', '5432 9876 1234', 'AP-GNT-ROR-2024-884');
  stmtUser.run('Suresh Patel', '9876543211', 'FARMER', 'Guntur', 'Andhra Pradesh', '8765 4321 5678', 'AP-GNT-ROR-2024-912');
  stmtUser.run('Lakshmi Devi', '9876543212', 'FARMER', 'Krishna', 'Andhra Pradesh', '3456 7890 2345', 'AP-KRI-ROR-2024-102');
  stmtUser.run('Venkat Rao', '9876543213', 'FARMER', 'Guntur', 'Andhra Pradesh', '9012 3456 7890', 'AP-GNT-ROR-2024-349');
  stmtUser.run('Anil Verma', '9876543214', 'FARMER', 'Kurnool', 'Andhra Pradesh', '6789 0123 4567', 'AP-KRN-ROR-2024-551');
  stmtUser.run('Officer Admin', '9999999999', 'ADMIN', 'Guntur', 'Andhra Pradesh', '1111 2222 3333', 'GOVT-ADMIN-EMP-01');

  // 3. Insert Centres
  const stmtCentre = db.prepare('INSERT INTO centres (name, code, district, state, capacity_qtl) VALUES (?, ?, ?, ?, ?)');
  stmtCentre.run('Guntur Main APMC Mandi', 'AP-GNT-01', 'Guntur', 'Andhra Pradesh', 1000);
  stmtCentre.run('Vijayawada Rythu Hub', 'AP-VJA-02', 'Krishna', 'Andhra Pradesh', 800);
  stmtCentre.run('Kurnool Cotton & Grain Mandi', 'AP-KRN-03', 'Kurnool', 'Andhra Pradesh', 1200);

  // 4. Insert 8 Major Andhra Pradesh Crops with Official MSP Rates
  const stmtCrop = db.prepare('INSERT INTO crops (name, category, msp_rate_per_qtl) VALUES (?, ?, ?)');
  stmtCrop.run('Paddy (వరి / Dhan)', 'Cereal', 2300);
  stmtCrop.run('Cotton (పత్తి / Kapas)', 'Fiber', 7020);
  stmtCrop.run('Maize (మొక్కజొన్న / Makka)', 'Coarse Grain', 2090);
  stmtCrop.run('Groundnut (వేరుశనగ / Moongfali)', 'Oilseed', 6783);
  stmtCrop.run('Red Chilli (మిర్చి / Lal Mirch)', 'Spice', 5400);
  stmtCrop.run('Sunflower (పొద్దుతిరుగుడు / Surajmukhi)', 'Oilseed', 7280);
  stmtCrop.run('Turmeric (పసుపు / Haldi)', 'Commercial', 9000);
  stmtCrop.run('Jowar (జొన్న / Jawar)', 'Coarse Grain', 3371);

  // 5. Multi-Day Slots: Today, Tomorrow, and 3 Days from now (to test 2-day cancellation policy)
  const dToday = new Date();
  const today = dToday.toISOString().split('T')[0];

  const dTomorrow = new Date();
  dTomorrow.setDate(dToday.getDate() + 1);
  const tomorrow = dTomorrow.toISOString().split('T')[0];

  const dIn3Days = new Date();
  dIn3Days.setDate(dToday.getDate() + 3);
  const in3Days = dIn3Days.toISOString().split('T')[0];

  const stmtSlot = db.prepare('INSERT INTO slots (centre_id, slot_date, time_window, max_capacity, booked_count) VALUES (?, ?, ?, ?, ?)');

  // Slots Today
  stmtSlot.run(1, today, '06:00 AM - 09:00 AM', 30, 4);
  stmtSlot.run(1, today, '09:00 AM - 12:00 PM', 30, 8);
  stmtSlot.run(1, today, '12:00 PM - 03:00 PM', 30, 2);
  stmtSlot.run(1, today, '03:00 PM - 06:00 PM', 30, 0);

  // Slots Tomorrow
  stmtSlot.run(1, tomorrow, '06:00 AM - 09:00 AM', 30, 2);
  stmtSlot.run(1, tomorrow, '09:00 AM - 12:00 PM', 30, 5);
  stmtSlot.run(1, tomorrow, '12:00 PM - 03:00 PM', 30, 1);
  stmtSlot.run(1, tomorrow, '03:00 PM - 06:00 PM', 30, 0);

  // Slots in 3 Days (Valid for cancellation test)
  stmtSlot.run(1, in3Days, '06:00 AM - 09:00 AM', 30, 1);
  stmtSlot.run(1, in3Days, '09:00 AM - 12:00 PM', 30, 0);
  stmtSlot.run(1, in3Days, '12:00 PM - 03:00 PM', 30, 0);
  stmtSlot.run(1, in3Days, '03:00 PM - 06:00 PM', 30, 0);

  // 6. Insert Sample Bookings across workflow stages
  const stmtBooking = db.prepare(`
    INSERT INTO bookings (
      id, farmer_id, farmer_name, farmer_phone, centre_id, centre_name,
      crop_id, crop_name, msp_rate, slot_id, booking_date, time_window,
      estimated_qtl, status, token_number, arrived_at, quality_checked_at, weighed_at, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();

  // Booking 1: Freshly Booked for Today (Ramesh Kumar - 9876543210)
  stmtBooking.run(
    'BK-1001', 1, 'Ramesh Kumar', '9876543210', 1, 'Guntur Main APMC Mandi',
    1, 'Paddy (వరి / Dhan)', 2300, 1, today, '06:00 AM - 09:00 AM',
    45.0, 'BOOKED', 'Q-101', null, null, null, null
  );

  // Booking 2: Arrived at Gate (Suresh Patel - 9876543211)
  stmtBooking.run(
    'BK-1002', 2, 'Suresh Patel', '9876543211', 1, 'Guntur Main APMC Mandi',
    2, 'Cotton (పత్తి / Kapas)', 7020, 1, today, '06:00 AM - 09:00 AM',
    60.0, 'ARRIVED', 'Q-102', now, null, null, null
  );

  // Booking 3: Quality Passed (Lakshmi Devi - 9876543212)
  stmtBooking.run(
    'BK-1003', 3, 'Lakshmi Devi', '9876543212', 1, 'Guntur Main APMC Mandi',
    4, 'Groundnut (వేరుశనగ / Moongfali)', 6783, 2, today, '09:00 AM - 12:00 PM',
    35.0, 'QUALITY_PASSED', 'Q-103', now, now, null, null
  );
  db.prepare('INSERT INTO quality_inspections (booking_id, moisture_pct, foreign_matter_pct, grade, status, notes) VALUES (?, ?, ?, ?, ?, ?)')
    .run('BK-1003', 8.2, 0.5, 'Grade A', 'PASSED', 'Groundnut pod moisture well within 9.0% threshold.');

  // Booking 4: Weighed (Venkat Rao - 9876543213)
  stmtBooking.run(
    'BK-1004', 4, 'Venkat Rao', '9876543213', 1, 'Guntur Main APMC Mandi',
    5, 'Red Chilli (మిర్చి / Lal Mirch)', 5400, 2, today, '09:00 AM - 12:00 PM',
    50.0, 'WEIGHED', 'Q-104', now, now, now, null
  );
  db.prepare('INSERT INTO quality_inspections (booking_id, moisture_pct, foreign_matter_pct, grade, status, notes) VALUES (?, ?, ?, ?, ?, ?)')
    .run('BK-1004', 10.5, 0.4, 'Grade A', 'PASSED', 'Export quality Guntur Red Chilli batch.');
  db.prepare('INSERT INTO weighments (booking_id, gross_weight_kg, tare_weight_kg, net_weight_kg, net_weight_qtl) VALUES (?, ?, ?, ?, ?)')
    .run('BK-1004', 6200, 1200, 5000, 50.0);

  // Booking 5: Fully Paid (Anil Verma - 9876543214)
  stmtBooking.run(
    'BK-1005', 5, 'Anil Verma', '9876543214', 1, 'Guntur Main APMC Mandi',
    3, 'Maize (మొక్కజొన్న / Makka)', 2090, 1, today, '06:00 AM - 09:00 AM',
    40.0, 'PAYMENT_PROCESSED', 'Q-105', now, now, now, now
  );
  db.prepare('INSERT INTO quality_inspections (booking_id, moisture_pct, foreign_matter_pct, grade, status, notes) VALUES (?, ?, ?, ?, ?, ?)')
    .run('BK-1005', 12.0, 0.8, 'Grade A', 'PASSED', 'Standard procurement batch.');
  db.prepare('INSERT INTO weighments (booking_id, gross_weight_kg, tare_weight_kg, net_weight_kg, net_weight_qtl) VALUES (?, ?, ?, ?, ?)')
    .run('BK-1005', 5400, 1400, 4000, 40.0);
  db.prepare('INSERT INTO payments (booking_id, total_qtl, msp_rate, gross_amount, net_amount, bank_ref, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run('BK-1005', 40.0, 2090, 83600, 83600, 'PFMS-DBT-2026-9920148', 'PROCESSED');

  // Booking 6: Future Booking for 3 Days from now (Eligible for 2-day cancellation demo)
  stmtBooking.run(
    'BK-1006', 1, 'Ramesh Kumar', '9876543210', 1, 'Guntur Main APMC Mandi',
    7, 'Turmeric (పసుపు / Haldi)', 9000, 9, in3Days, '06:00 AM - 09:00 AM',
    25.0, 'BOOKED', 'Q-106', null, null, null, null
  );

  // Initial SMS Messages
  const stmtSms = db.prepare('INSERT INTO sms_messages (phone, farmer_name, type, message) VALUES (?, ?, ?, ?)');
  stmtSms.run('9876543210', 'Ramesh Kumar', 'BOOKING_CONFIRMATION', `GOVT OF AP: Namaste Ramesh Kumar! Booking Confirmed. Token: Q-101. Crop: Paddy. Date: ${today} (06:00 AM - 09:00 AM) at Guntur Main APMC Mandi. Helpline: 1800-180-1551.`);
  stmtSms.run('9876543214', 'Anil Verma', 'PAYMENT_CONFIRMATION', `GOVT OF AP: ₹83,600 credited to Anil Verma via PFMS/DBT for Maize (40 QTL) Ref: PFMS-DBT-2026-9920148. Jai Kisan!`);

  console.log('Database Seeding Complete with AP Crops and Multi-Day Slots!');
}

seedDatabase();
