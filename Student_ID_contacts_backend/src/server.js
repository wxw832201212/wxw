const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// 使用CORS中间件，允许特定的源请求
const allowedOrigins = [
    'http://114.55.128.122:3000',
    'http://114.55.128.122',
    'http://0.0.0.0:3000',
    'http://0.0.0.0:80'
];
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 添加OPTIONS方法
    credentials: true // 如果需要传递cookies等凭证信息
}));

// 使用JSON中间件
app.use(express.json());
app.use(express.static('../frontend'));

// 路由，根路径用于调试和确认服务器运行
app.get('/', (req, res) => {
    res.send('Welcome to the Contacts App API');
});

// MySQL数据库设置
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', // 请将此处替换为您的MySQL密码
    database: 'contacts_app'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to the MySQL database.');
        // 如果contacts表不存在，则创建它
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(15) NOT NULL,
                email VARCHAR(255),
                special_interest BOOLEAN DEFAULT FALSE
            );
        `;
        db.query(createTableQuery, err => {
            if (err) {
                console.error('Failed to create contacts table:', err.message);
            } else {
                console.log('Contacts table is ready.');
            }
        });
    }
});

// 定义API路由
// 获取所有联系人，按姓名排序，不区分中英文
app.get('/api/contacts', (req, res) => {
    db.query('SELECT * FROM contacts ORDER BY CONVERT(name USING gbk)', (err, results) => {
        if (err) {
            console.error('Error fetching contacts:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// 根据姓名搜索联系人
app.get('/api/contacts/search', (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Name query parameter is required.' });
    }
    const sql = 'SELECT * FROM contacts WHERE name LIKE ? ORDER BY CONVERT(name USING gbk)';
    db.query(sql, [`%${name}%`], (err, results) => {
        if (err) {
            console.error('Error searching contacts:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// 添加新联系人
app.post('/api/contacts', (req, res) => {
    console.log('Request Body:', req.body); // Debugging line
    const { name, phone, email, special_interest } = req.body;
    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone number are required.' });
    }
    if (!/^[0-9]{11}$/.test(phone)) {
        return res.status(400).json({ error: 'Phone number must be 11 digits.' });
    }
    if (email && !/@/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }
    const sql = 'INSERT INTO contacts (name, phone, email, special_interest) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, phone, email, special_interest || false], (err, result) => {
        if (err) {
            console.error('Error adding contact:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: result.insertId, name, phone, email, special_interest: special_interest || false });
        }
    });
});

// 更新联系人
app.put('/api/contacts/:id', (req, res) => {
    console.log('Request Body:', req.body); // Debugging line
    const { name, phone, email, special_interest } = req.body;
    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone number are required.' });
    }
    if (!/^[0-9]{11}$/.test(phone)) {
        return res.status(400).json({ error: 'Phone number must be 11 digits.' });
    }
    if (email && !/@/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }
    const sql = 'UPDATE contacts SET name = ?, phone = ?, email = ?, special_interest = ? WHERE id = ?';
    db.query(sql, [name, phone, email, special_interest, req.params.id], (err, result) => {
        if (err) {
            console.error('Error updating contact:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: req.params.id, name, phone, email, special_interest });
        }
    });
});

// 删除联系人
app.delete('/api/contacts/:id', (req, res) => {
    const sql = 'DELETE FROM contacts WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting contact:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ deletedID: req.params.id });
        }
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running at http://114.55.128.122:${port}`);
});