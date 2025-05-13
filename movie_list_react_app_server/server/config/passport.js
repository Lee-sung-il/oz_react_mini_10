const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User = require('../models/user');

// 이메일 기반 인증 전략 설정
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username });
            if (!user) return done(null, false, { message: '사용자 없음' });

            const isValid = await user.validatePassword(password);
            if (!isValid) return done(null, false, { message: '비밀번호 오류' });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// 사용자 ID를 세션에 저장
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// 세션에서 사용자 ID로 사용자 조회 (이메일 포함해서 복원)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('email');
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;