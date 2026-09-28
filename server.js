const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static frontend prototype files
app.use('/prototype', express.static(path.join(__dirname, 'kisan_procurement_connect_prototype/stitch_kisan_procurement_connect_prototype')));

// Add KYC columns to users table if missing
try {
  db.exec('ALTER TABLE users ADD COLUMN aadhaar TEXT;');
  db.exec('ALTER TABLE users ADD COLUMN land_record_id TEXT;');
  db.exec('ALTER TABLE users ADD COLUMN bank_ifsc TEXT;');
} catch (e) {}

// ==========================================
// 1. AUTHENTICATION & FARMER KYC REGISTRATION
// ==========================================

app.post('/api/auth/login', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  const stmt = db.prepare('SELECT * FROM users WHERE phone = ?');
  const user = stmt.get(phone);

  if (user) {
    return res.json({ success: true, user });
  } else {
    // Auto-register demo farmer
    const insertStmt = db.prepare('INSERT INTO users (name, phone, role, district, state) VALUES (?, ?, ?, ?, ?)');
    const result = insertStmt.run(`Farmer (${phone.slice(-4)})`, phone, 'FARMER', 'Guntur', 'Andhra Pradesh');
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    return res.json({ success: true, user: newUser, created: true });
  }
});

// Farmer Registration & Aadhaar/Land KYC
app.post('/api/auth/register-kyc', (req, res) => {
  const { name, phone, aadhaar, land_record_id, district, state, bank_account, bank_ifsc } = req.body;

  if (!name || !phone || !aadhaar || !land_record_id) {
    return res.status(400).json({ error: 'Name, Phone, Aadhaar number, and Land Record ID are required' });
  }

  // Check if farmer already exists
  const existing = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);

  if (existing) {
    db.prepare(`
      UPDATE users 
      SET name = ?, aadhaar = ?, land_record_id = ?, district = ?, state = ?, bank_account_no = ?, bank_ifsc = ?
      WHERE phone = ?
    `).run(name, aadhaar, land_record_id, district || 'Guntur', state || 'Andhra Pradesh', bank_account || '', bank_ifsc || '', phone);

    const updated = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    return res.json({ success: true, user: updated, message: 'Farmer KYC verification updated successfully!' });
  } else {
    const insertStmt = db.prepare(`
      INSERT INTO users (name, phone, role, district, state, aadhaar, land_record_id, bank_account_no, bank_ifsc)
      VALUES (?, ?, 'FARMER', ?, ?, ?, ?, ?, ?)
    `);
    const result = insertStmt.run(name, phone, district || 'Guntur', state || 'Andhra Pradesh', aadhaar, land_record_id, bank_account || '', bank_ifsc || '');
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, user: newUser, message: 'Aadhaar & Land Records Verified! Registration complete.' });
  }
});

// ==========================================
// 2. MASTER DATA APIS
// ==========================================

app.get('/api/centres', (req, res) => {
  const stmt = db.prepare('SELECT * FROM centres ORDER BY name ASC');
  res.json(stmt.all());
});

app.get('/api/crops', (req, res) => {
  const stmt = db.prepare('SELECT * FROM crops ORDER BY name ASC');
  res.json(stmt.all());
});

app.get('/api/slots', (req, res) => {
  const { centre_id, date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  const targetCentre = centre_id || 1;

  const stmt = db.prepare('SELECT * FROM slots WHERE centre_id = ? AND slot_date = ?');
  let slots = stmt.all(targetCentre, targetDate);

  if (slots.length === 0) {
    const defaultWindows = [
      '08:00 AM - 10:00 AM',
      '10:00 AM - 12:00 PM',
      '12:00 PM - 02:00 PM',
      '02:00 PM - 04:00 PM'
    ];
    const insertSlot = db.prepare('INSERT INTO slots (centre_id, slot_date, time_window, max_capacity, booked_count) VALUES (?, ?, ?, ?, ?)');
    defaultWindows.forEach(w => insertSlot.run(targetCentre, targetDate, w, 30, 0));
    slots = stmt.all(targetCentre, targetDate);
  }

  res.json(slots);
});

// ==========================================
// 3. FARMER BOOKING & QUEUE APIS
// ==========================================

app.post('/api/bookings', (req, res) => {
  const { farmer_id, centre_id, crop_id, slot_id, estimated_qtl } = req.body;

  if (!farmer_id || !centre_id || !crop_id || !slot_id || !estimated_qtl) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const farmer = db.prepare('SELECT * FROM users WHERE id = ?').get(farmer_id);
  const centre = db.prepare('SELECT * FROM centres WHERE id = ?').get(centre_id);
  const crop = db.prepare('SELECT * FROM crops WHERE id = ?').get(crop_id);
  const slot = db.prepare('SELECT * FROM slots WHERE id = ?').get(slot_id);

  if (!farmer || !centre || !crop || !slot) {
    return res.status(404).json({ error: 'Invalid reference data for booking' });
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `BK-${randomNum}`;
  const tokenNum = `Q-${Math.floor(100 + Math.random() * 900)}`;

  const stmt = db.prepare(`
    INSERT INTO bookings (
      id, farmer_id, farmer_name, farmer_phone, centre_id, centre_name,
      crop_id, crop_name, msp_rate, slot_id, booking_date, time_window,
      estimated_qtl, status, token_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'BOOKED', ?)
  `);

  stmt.run(
    bookingId, farmer.id, farmer.name, farmer.phone, centre.id, centre.name,
    crop.id, crop.name, crop.msp_rate_per_qtl, slot.id, slot.slot_date, slot.time_window,
    parseFloat(estimated_qtl), tokenNum
  );

  db.prepare('UPDATE slots SET booked_count = booked_count + 1 WHERE id = ?').run(slot.id);

  const newBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
  res.status(201).json({ success: true, booking: newBooking });
});

app.get('/api/bookings/farmer/:phone', (req, res) => {
  const stmt = db.prepare('SELECT * FROM bookings WHERE farmer_phone = ? ORDER BY created_at DESC');
  res.json(stmt.all(req.params.phone));
});

app.get('/api/bookings/:id', (req, res) => {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const quality = db.prepare('SELECT * FROM quality_inspections WHERE booking_id = ?').get(booking.id);
  const weighment = db.prepare('SELECT * FROM weighments WHERE booking_id = ?').get(booking.id);
  const payment = db.prepare('SELECT * FROM payments WHERE booking_id = ?').get(booking.id);

  res.json({ booking, quality, weighment, payment });
});

app.get('/api/queue/live/:centre_id', (req, res) => {
  const centreId = req.params.centre_id;
  const today = new Date().toISOString().split('T')[0];

  const arrived = db.prepare(`
    SELECT * FROM bookings 
    WHERE centre_id = ? AND booking_date = ? AND status IN ('ARRIVED', 'QUALITY_PASSED', 'WEIGHED')
    ORDER BY arrived_at ASC
  `).all(centreId, today);

  const currentlyServing = arrived.find(b => b.status === 'QUALITY_PASSED' || b.status === 'ARRIVED') || arrived[0] || null;

  res.json({
    centre_id: centreId,
    date: today,
    currently_serving_token: currentlyServing ? currentlyServing.token_number : 'None',
    total_in_queue: arrived.length,
    queue: arrived
  });
});

// ==========================================
// 4. ADMIN & MANDI OPERATIONS APIS
// ==========================================

app.post('/api/admin/gate/scan', (req, res) => {
  const { booking_id } = req.body;
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking_id);

  if (!booking) return res.status(404).json({ error: 'Booking ID not found' });

  const now = new Date().toISOString();
  db.prepare("UPDATE bookings SET status = 'ARRIVED', arrived_at = ? WHERE id = ?").run(now, booking.id);

  const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking.id);
  res.json({ success: true, message: `Farmer ${booking.farmer_name} checked in successfully!`, booking: updated });
});

app.get('/api/admin/queue/pending-quality', (req, res) => {
  const stmt = db.prepare("SELECT * FROM bookings WHERE status = 'ARRIVED' ORDER BY arrived_at ASC");
  res.json(stmt.all());
});

app.post('/api/admin/quality/submit', (req, res) => {
  const { booking_id, moisture_pct, foreign_matter_pct, grade, notes } = req.body;

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking_id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const moisture = parseFloat(moisture_pct);
  const status = moisture <= 14.0 ? 'PASSED' : 'REJECTED';
  const bookingStatus = status === 'PASSED' ? 'QUALITY_PASSED' : 'QUALITY_REJECTED';
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO quality_inspections (booking_id, moisture_pct, foreign_matter_pct, grade, status, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(booking.id, moisture, parseFloat(foreign_matter_pct || 0), grade || 'Grade A', status, notes || '');

  db.prepare('UPDATE bookings SET status = ?, quality_checked_at = ? WHERE id = ?').run(bookingStatus, now, booking.id);

  res.json({ success: true, status, bookingStatus, message: `Quality inspection recorded: ${status}` });
});

app.get('/api/admin/queue/pending-weighment', (req, res) => {
  const stmt = db.prepare("SELECT * FROM bookings WHERE status = 'QUALITY_PASSED' ORDER BY quality_checked_at ASC");
  res.json(stmt.all());
});

app.post('/api/admin/weighbridge/submit', (req, res) => {
  const { booking_id, gross_weight_kg, tare_weight_kg } = req.body;

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking_id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const gross = parseFloat(gross_weight_kg);
  const tare = parseFloat(tare_weight_kg);
  const netKg = gross - tare;
  const netQtl = netKg / 100.0;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO weighments (booking_id, gross_weight_kg, tare_weight_kg, net_weight_kg, net_weight_qtl)
    VALUES (?, ?, ?, ?, ?)
  `).run(booking.id, gross, tare, netKg, netQtl);

  db.prepare("UPDATE bookings SET status = 'WEIGHED', weighed_at = ? WHERE id = ?").run(now, booking.id);

  res.json({ success: true, netKg, netQtl, message: `Weighbridge recorded: ${netQtl} Quintals net weight` });
});

app.get('/api/admin/queue/pending-payment', (req, res) => {
  const stmt = db.prepare(`
    SELECT b.*, w.net_weight_qtl 
    FROM bookings b
    JOIN weighments w ON b.id = w.booking_id
    WHERE b.status = 'WEIGHED'
    ORDER BY b.weighed_at ASC
  `);
  res.json(stmt.all());
});

app.post('/api/admin/payment/approve', (req, res) => {
  const { booking_id } = req.body;

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking_id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const weighment = db.prepare('SELECT * FROM weighments WHERE booking_id = ?').get(booking.id);
  if (!weighment) return res.status(400).json({ error: 'Weighment data missing' });

  const totalQtl = weighment.net_weight_qtl;
  const mspRate = booking.msp_rate;
  const totalAmount = totalQtl * mspRate;
  const bankRef = `PFMS-DBT-2026-${Math.floor(1000000 + Math.random() * 9000000)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO payments (booking_id, total_qtl, msp_rate, gross_amount, net_amount, bank_ref, status)
    VALUES (?, ?, ?, ?, ?, ?, 'PROCESSED')
  `).run(booking.id, totalQtl, mspRate, totalAmount, totalAmount, bankRef);

  db.prepare("UPDATE bookings SET status = 'PAYMENT_PROCESSED', completed_at = ? WHERE id = ?").run(now, booking.id);

  res.json({
    success: true,
    totalQtl,
    mspRate,
    totalAmount,
    bankRef,
    message: `Payment of ₹${totalAmount.toLocaleString('en-IN')} authorized & PFMS/DBT transfer initiated: ${bankRef}`
  });
});

// ==========================================
// 5. ADMIN SLOT MANAGEMENT & MONITORING ANALYTICS
// ==========================================

app.get('/api/admin/slots/manage', (req, res) => {
  const { centre_id, date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  const targetCentre = centre_id || 1;

  const slots = db.prepare('SELECT * FROM slots WHERE centre_id = ? AND slot_date = ?').all(targetCentre, targetDate);
  const bookings = db.prepare(`
    SELECT * FROM bookings 
    WHERE centre_id = ? AND booking_date = ? 
    ORDER BY time_window ASC, token_number ASC
  `).all(targetCentre, targetDate);

  const slotDetails = slots.map(s => {
    const slotBookings = bookings.filter(b => b.slot_id === s.id || b.time_window === s.time_window);
    const totalEstQtl = slotBookings.reduce((sum, b) => sum + b.estimated_qtl, 0);
    return {
      ...s,
      expected_farmers_count: slotBookings.length,
      estimated_total_quintals: totalEstQtl,
      farmers: slotBookings
    };
  });

  const totalExpectedFarmers = bookings.length;
  const totalEstimatedQuintals = bookings.reduce((sum, b) => sum + b.estimated_qtl, 0);

  res.json({
    centre_id: targetCentre,
    date: targetDate,
    summary: {
      total_slots: slots.length,
      total_expected_farmers: totalExpectedFarmers,
      total_estimated_quintals: totalEstimatedQuintals
    },
    slots: slotDetails,
    manifest: bookings
  });
});

app.post('/api/admin/slots/config', (req, res) => {
  const { centre_id, slot_date, time_window, max_capacity } = req.body;

  if (!centre_id || !slot_date || !time_window || !max_capacity) {
    return res.status(400).json({ error: 'Missing slot configuration parameters' });
  }

  const stmt = db.prepare('INSERT INTO slots (centre_id, slot_date, time_window, max_capacity, booked_count) VALUES (?, ?, ?, ?, 0)');
  const result = stmt.run(centre_id, slot_date, time_window, parseInt(max_capacity));

  const newSlot = db.prepare('SELECT * FROM slots WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, slot: newSlot, message: `New slot '${time_window}' added successfully!` });
});

// Advanced Monitoring & Analytics Endpoint (As required in diagram)
app.get('/api/admin/analytics', (req, res) => {
  const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
  const arrivedCount = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status IN ('ARRIVED', 'QUALITY_PASSED', 'WEIGHED', 'PAYMENT_PROCESSED')").get().count;
  const qualityPassed = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status IN ('QUALITY_PASSED', 'WEIGHED', 'PAYMENT_PROCESSED')").get().count;
  const totalProcuredQtl = db.prepare('SELECT COALESCE(SUM(net_weight_qtl), 0) as total FROM weighments').get().total;
  const totalDisbursedAmt = db.prepare('SELECT COALESCE(SUM(net_amount), 0) as total FROM payments').get().total;

  // Crop Breakdown
  const cropStats = db.prepare(`
    SELECT crop_name, COUNT(*) as bookings_count, SUM(estimated_qtl) as est_quintals
    FROM bookings
    GROUP BY crop_name
  `).all();

  // Centre Load
  const centreStats = db.prepare(`
    SELECT centre_name, COUNT(*) as active_farmers
    FROM bookings
    WHERE status IN ('BOOKED', 'ARRIVED', 'QUALITY_PASSED', 'WEIGHED')
    GROUP BY centre_name
  `).all();

  res.json({
    summary: {
      total_bookings: totalBookings,
      arrived_count: arrivedCount,
      quality_passed_count: qualityPassed,
      total_procured_quintals: Math.round(totalProcuredQtl * 100) / 100,
      total_disbursed_inr: Math.round(totalDisbursedAmt)
    },
    centre_load: centreStats,
    crop_analytics: cropStats,
    staffing_needs: {
      gatekeepers_active: 2,
      quality_inspectors_active: 3,
      weighbridge_operators_active: 2,
      recommended_extra_staff: arrivedCount > 10 ? 'Add 1 Quality Inspector' : 'Optimal Staffing'
    }
  });
});

app.get('/api/admin/stats', (req, res) => {
  const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
  const arrivedCount = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status IN ('ARRIVED', 'QUALITY_PASSED', 'WEIGHED', 'PAYMENT_PROCESSED')").get().count;
  const qualityPassed = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status IN ('QUALITY_PASSED', 'WEIGHED', 'PAYMENT_PROCESSED')").get().count;
  const totalProcuredQtl = db.prepare('SELECT COALESCE(SUM(net_weight_qtl), 0) as total FROM weighments').get().total;
  const totalDisbursedAmt = db.prepare('SELECT COALESCE(SUM(net_amount), 0) as total FROM payments').get().total;

  res.json({
    total_bookings: totalBookings,
    arrived_count: arrivedCount,
    quality_passed_count: qualityPassed,
    total_procured_quintals: Math.round(totalProcuredQtl * 100) / 100,
    total_disbursed_inr: Math.round(totalDisbursedAmt)
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌾 Kisan Procurement Connect Engine Running!`);
  console.log(`📍 Web Application URL: http://localhost:${PORT}`);
  console.log(`📍 Admin Operations Portal: http://localhost:${PORT}/admin`);
  console.log(`📍 Farmer Portal: http://localhost:${PORT}/farmer`);
  console.log(`=======================================================`);
});
