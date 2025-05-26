const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const passport = require('./config/passport');
const User = require('./models/user');
require('dotenv').config(); // 이 줄이 있어야 .env 파일이 적용됩니다

const app = express();
const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/movieUsers';

mongoose.connect(DB_URL)
    .then(() => console.log('✅ MongoDB 연결 성공'))
    .catch((err) => console.error('❌ MongoDB 연결 실패:', err));

app.use(cors({
    origin: [
        'http://localhost:5173',
        "oz-react-mini-10-movieproject.vercel.app",
        "https://oz-react-mini-10-movieproject-git-main-lee-sung-ils-projects.vercel.app/"
    ],
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: DB_URL}),
    cookie: {
        sameSite: 'none',
        secure: true
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/api/register', async (req, res) => {
    const {name, email, password} = req.body;
    const exists = await User.findOne({email});
    if (exists) return res.status(400).json({message: '이미 존재하는 사용자입니다.'});

    const user = new User({name, email, password});
    await user.save();
    req.login(user, (err) => {
        if (err) return res.status(500).json({message: '세션 오류'});
        res.json({message: '회원가입 성공'});
    });
});

app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({message: info.message});
        req.login(user, (loginErr) => {
            if (loginErr) return res.status(500).json({message: '세션 로그인 실패'});
            res.json({message: '로그인 성공', user: {name: user.name, email: user.email}});
        });
    })(req, res, next);
});

app.get('/api/current-user', (req, res) => {
    if (req.isAuthenticated()) res.json({user: {name: req.user.name, email: req.user.email}});
    else res.status(401).json({message: '인증되지 않음'});
});


app.post('/api/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({message: '로그아웃 실패'});
        res.json({message: '로그아웃 성공'});
    });
});

// Google OAuth routes
app.get('/auth/google', (req, res, next) => {
    req.session.returnTo = process.env.CLIENT_URL || 'http://localhost:5173';
    next();
}, passport.authenticate('google', {scope: ['profile', 'email']}));

function successReturnToOrRedirect(defaultRedirect) {
    return (req, res) => {
        const redirectUrl = req.session.returnTo || defaultRedirect;
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    };
}

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
    }),
    successReturnToOrRedirect(process.env.CLIENT_URL || 'http://localhost:5173')
);

// Kakao OAuth routes
app.get('/auth/kakao', (req, res, next) => {
    req.session.returnTo = process.env.CLIENT_URL || 'http://localhost:5173';
    next();
}, passport.authenticate('kakao'));

app.get('/auth/kakao/callback',
    passport.authenticate('kakao', {
        failureRedirect: '/login',
    }),
    successReturnToOrRedirect(process.env.CLIENT_URL || 'http://localhost:5173')
);

app.listen(PORT, () => {
    console.log(`✅ http://localhost:${PORT} 에서 서버 실행 중`);
});
