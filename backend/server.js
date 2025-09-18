const express = require('express');
const getConnection = require('./config/database');
const sendEmail = require('./config/mailer');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Evidence Routes

// GET semua evidence
app.get('/api/evidences', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM evidences ORDER BY id DESC'
        );
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Get evidences error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST tambah evidence
app.post('/api/evidences', async (req, res) => {
    try {
        const { temuan, rekomendasi, status, kriteria, progress, tanggal } = req.body;

        const connection = await getConnection();
        const [result] = await connection.execute(
            `INSERT INTO evidences 
            (temuan, rekomendasi, status, kriteria, progress, tanggal) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [temuan, rekomendasi, status || 'Draft', kriteria, progress, tanggal]
        );
        await connection.end();

        res.status(201).json({
            id: result.insertId,
            message: 'Evidence created successfully!'
        });
    } catch (error) {
        console.error('Create evidence error:', error);
        res.status(500).json({ error: 'Failed to create evidence' });
    }
});

// GET evidence sesuai ID
app.get('/api/evidences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM evidences WHERE id = ?',
            [id]
        );
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Evidence not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Get evidence error:', error);
        res.status(500).json({ error: 'Failed to get evidence' });
    }
});

// PUT update evidence
app.put('/api/evidences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { temuan, rekomendasi, status, kriteria, progress, tanggal } = req.body;

        const connection = await getConnection();
        const [result] = await connection.execute(
            `UPDATE evidences 
             SET temuan = ?, rekomendasi = ?, status = ?, kriteria = ?, progress = ?, tanggal = ?
             WHERE id = ?`,
            [temuan, rekomendasi, status, kriteria, progress, tanggal, id]
        );
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Evidence not found' });
        }
        res.json({ message: 'Evidence updated successfully!' });
    } catch (error) {
        console.error('Update evidence error:', error);
        res.status(500).json({ error: 'Failed to update evidence' });
    }
});

// DELETE evidence
app.delete('/api/evidences/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const connection = await getConnection();
        const [result] = await connection.execute(
            'DELETE FROM evidences WHERE id = ?',
            [id]
        );
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Evidence not found' });
        }
        res.json({ message: 'Evidence deleted successfully' });
    } catch (error) {
        console.error('Delete evidence error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Email Routes

// POST kirim email
app.post('/api/send-email', async (req, res) => {
    console.log('Request body:', req.body);
    const { to, subject, text, html } = req.body;

    try {
        const info = await sendEmail({ to, subject, text, html });
        console.log('Email berhasil dikirim:', info.response);
        res.status(200).json({ message: 'Email sent!', info: info.response });
    } catch (err) {
        console.error('Send email error detail:', err);
        res.status(500).json({ error: err.message });
    }
});


// POST simpen email history
app.post('/api/email-history', async (req, res) => {
    try {
        const { to, evidenceId, message, status, sentAt } = req.body;

        const connection = await getConnection();
        const [result] = await connection.execute(
            `INSERT INTO report
            (email_to, evidenceId, message, status, sentAt) 
            VALUES (?, ?, ?, ?, ?)`,
            [to, evidenceId, message, status, sentAt]
        );
        await connection.end();

        res.status(201).json({ id: result.insertId, message: 'History saved!' });
    } catch (error) {
        console.error('Save history error:', error);
        res.status(500).json({ error: 'Failed to save email history' });
    }
});

// GET semua email history
app.get('/api/email-history', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM report ORDER BY sentAt DESC'
        );
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to load email history' });
    }
});

// Audit Routes

// GET semua audits
app.get('/api/audit', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM audit ORDER BY id DESC'
        );
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Get audits error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET audit sesuai ID
app.get('/api/audit/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM audit WHERE id = ?',
            [id]
        );
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Audit not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Get audit error:', error);
        res.status(500).json({ error: 'Failed to get audit' });
    }
});

// POST tambah audit
app.post('/api/audit', async (req, res) => {
    try {
        const { auditName, category, auditee, startDate, endDate } = req.body;

        const connection = await getConnection();
        const [result] = await connection.execute(
            `INSERT INTO audit (auditName, category, auditee, startDate, endDate)
             VALUES (?, ?, ?, ?, ?)`,
            [auditName, category, auditee, startDate, endDate]
        );
        await connection.end();

        res.status(201).json({ id: result.insertId, message: 'Audit created successfully!' });
    } catch (error) {
        console.error('Create audit error:', error);
        res.status(500).json({ error: 'Failed to create audit' });
    }
});

// PUT update audit
app.put('/api/audit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { auditName, category, auditee, startDate, endDate } = req.body;

        const connection = await getConnection();
        const [result] = await connection.execute(
            `UPDATE audit 
             SET auditName = ?, category = ?, auditee = ?, startDate = ?, endDate = ?
             WHERE id = ?`,
            [auditName, category, auditee, startDate, endDate, id]
        );
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Audit not found' });
        }
        res.json({ message: 'Audit updated successfully!' });
    } catch (error) {
        console.error('Update audit error:', error);
        res.status(500).json({ error: 'Failed to update audit' });
    }
});

// DELETE audit
app.delete('/api/audit/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const connection = await getConnection();
        const [result] = await connection.execute(
            'DELETE FROM audit WHERE id = ?',
            [id]
        );
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Audit not found' });
        }
        res.json({ message: 'Audit deleted successfully' });
    } catch (error) {
        console.error('Delete audit error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(3000, () => console.log('🚀 Server jalan di http://localhost:3000'));
