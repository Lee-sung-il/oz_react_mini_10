const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const passport = require('./config/passport');
const User = require('./models/user');

const app = express();
const PORT = 8080;

mongoose.connect('mongodb://localhost:27017/movieUsers')
    .then(() => console.log('✅ MongoDB 연결 성공'))
    .catch((err) => console.error('❌ MongoDB 연결 실패:', err));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/movieUsers' })
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });

    const user = new User({ email, password });
    await user.save();
    req.login(user, (err) => {
        if (err) return res.status(500).json({ message: '세션 오류' });
        res.json({ message: '회원가입 성공' });
    });
});

app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message });
        req.login(user, (loginErr) => {
            if (loginErr) return res.status(500).json({ message: '세션 로그인 실패' });
            res.json({ message: '로그인 성공', user: { email: user.email } });
        });
    })(req, res, next);
});

app.get('/api/current-user', (req, res) => {
    if (req.isAuthenticated()) res.json({ user: { email: req.user.email } });
    else res.status(401).json({ message: '인증되지 않음' });
});

app.post('/api/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: '로그아웃 실패' });
        res.json({ message: '로그아웃 성공' });
    });
});

app.listen(PORT, () => {
    console.log(`✅ http://localhost:${PORT} 에서 서버 실행 중`);
});
