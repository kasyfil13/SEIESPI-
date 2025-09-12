const express = require('express');
const getConnection = require('./config/database');
const sendEmail = require('./config/mailer'); // pakai 1 saja

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// GET semua dataa evidences
app.get('/api/evidences', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM evidences ORDER BY id DESC');
        await connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// GET evidence by ID
app.get('/api/evidences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM evidences WHERE id = ?', [id]);
        await connection.end();

        if (rows.length === 0) return res.status(404).json({ error: 'Evidence not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get evidence' });
    }
});

// POST buat kirim email
app.post('/api/send-email', async (req, res) => {
    const { to, subject, text, html } = req.body;

    try {
        await sendEmail({ to, subject, text, html });
        res.status(200).json({ message: 'Email berhasil dikirim!' });
    } catch (err) {
        console.error('Gagal kirim email:', err);
        res.status(500).json({ error: 'Gagal kirim email' });
    }
});

// PUT update evidence by id
app.put('/api/evidences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { temuan, rekomendasi, status, kriteria, progress, tanggal } = req.body;

        const connection = await getConnection();
        const [result] = await connection.execute(
            'UPDATE evidences SET temuan = ?, rekomendasi = ?, status = ?, kriteria = ?, progress = ?, tanggal = ? WHERE id = ?',
            [temuan, rekomendasi, status, kriteria, progress, tanggal, id]
        );
        await connection.end();

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Evidence not found' });

        res.json({ message: 'Evidence updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update evidence' });
    }
});

// DELETE evidence
app.delete('/api/evidences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const [result] = await connection.execute('DELETE FROM evidences WHERE id = ?', [id]);
        await connection.end();

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Evidence not found' });

        res.json({ message: 'Deleted successfully' });
    } catch (err) {

        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(3000, () => console.log('Server jalan di http://localhost:3000'));
