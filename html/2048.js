const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// SQLite 데이터베이스 설정
const dbPath = path.resolve(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

app.use(express.static('public')); // 미들웨어 설정

app.get('/', (req, res) => {
    res.sendFile("2048.html",{ root: './' });
});

// 테이블 생성
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
});

app.use(bodyParser.json());

// 로그인 API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // 간단한 예제를 위해 패스워드는 평문으로 저장됩니다. 실제로는 해싱이 필요합니다.
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.get(query, [username, password], (err, row) => {
        if (row) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});