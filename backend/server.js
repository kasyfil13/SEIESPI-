const express = require('express');
const getConnection = require('./config/database');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use(express.json()); 

app.get('/api/evidences', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM evidences ORDER BY id DESC');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/evidences', async (req, res) => {
    try {
        const { temuan, rekomendasi, status, kriteria, progress, tanggal } = req.body;
        
        const connection = await getConnection();
        const [result] = await connection.execute(
            'INSERT INTO evidences (temuan, rekomendasi, status, kriteria, progress, tanggal) VALUES (?, ?, ?, ?, ?, ?)',
            [temuan, rekomendasi, status || 'Draft', kriteria, progress, tanggal]
        );
        await connection.end();
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Evidence created successfully!' 
        });
    } catch (error) {
        console.error('Create error:', error);
        res.status(500).json({ error: 'Failed to create evidence' });
    }
});

app.get('/api/evidences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM evidences WHERE id = ?', [id]);
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Evidence not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Get by ID error:', error);
        res.status(500).json({ error: 'Failed to get evidence' });
    }
});



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
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Evidence not found' });
        }
        
        res.json({ message: 'Evidence updated successfully!' });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Failed to update evidence' });
    }
});

app.delete('/api/evidences/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM evidences WHERE id = ?', [id]);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Evidence not found' });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


app.listen(3000, () => {
    console.log('Server jalan di http://localhost:3000');
});