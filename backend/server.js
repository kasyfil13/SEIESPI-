const express = require('express');
const cors = require('cors');
const getConnection = require('./config/database');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// GET semua evi
app.get('/api/evidence', async (req, res) => {
  const db = await getConnection(); // <- ini yang missing
  const sql = `
    SELECT e.id AS evidence_id, e.evidence_name, e.status_saat_ini, e.progress_bulan_ini,
           r.id AS rekomendasi_id, r.deskripsi, r.kriteria,
           t.id AS temuan_id, t.temuan
    FROM evidence e
    JOIN rekomendasi r ON e.rekomendasi_id = r.id
    JOIN temuanpemeriksaan t ON r.temuan_id = t.id
  `;

  const [rows] = await db.query(sql);
  const data = rows.map(r => ({
    id: r.evidence_id,
    evidence_name: r.evidence_name,
    status_saat_ini: r.status_saat_ini,
    progress_bulan_ini: r.progress_bulan_ini,
    rekomendasi: {
      id: r.rekomendasi_id,
      deskripsi: r.deskripsi,
      kriteria: r.kriteria,
      temuan: {
        id: r.temuan_id,
        temuan: r.temuan
      }
    }
  }));

  res.json(data);
});

// POST evi ke db
app.post('/api/evidence', async (req, res) => {
  try {
    const db = await getConnection();
    const { evidence_name, status_saat_ini, progress_bulan_ini, rekomendasi } = req.body;

    const [temuanResult] = await db.query(
      'INSERT INTO temuanpemeriksaan (temuan) VALUES (?)',
      [rekomendasi.temuan.temuan]
    );

    const temuanId = temuanResult.insertId;

    const [rekomResult] = await db.query(
      'INSERT INTO rekomendasi (deskripsi, kriteria, temuan_id) VALUES (?, ?, ?)',
      [rekomendasi.deskripsi, rekomendasi.kriteria, temuanId]
    );

    const rekomId = rekomResult.insertId;

    const [evidenceResult] = await db.query(
      'INSERT INTO evidence (evidence_name, status_saat_ini, progress_bulan_ini, rekomendasi_id) VALUES (?, ?, ?, ?)',
      [evidence_name, status_saat_ini, progress_bulan_ini, rekomId]
    );

    res.json({ message: 'Evidence berhasil ditambahkan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//get temuanpemeriksaan
app.get('/api/temuan', async (req, res) => {
  const db = await getConnection();
  const [rows] = await db.query('SELECT id, temuan FROM temuanpemeriksaan');
  res.json(rows);
});

app.listen(3000, () => console.log('🚀 Server jalan di http://localhost:3000'));
