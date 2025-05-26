require('dotenv').config(); // ✅ 이 줄을 passport.js 가장 위에 추가
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
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

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) return done(null, existingUser);

    const user = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
    });
    await user.save();
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.use(new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID,
  callbackURL: '/auth/kakao/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ kakaoId: profile.id });
    if (existingUser) return done(null, existingUser);

    const user = new User({
      name: profile.username || profile.displayName || profile.nickname ,
      email: profile._json?.kakao_account?.email || `kakao_${profile.id}@noemail.com`,
      kakaoId: profile.id,
    });
    await user.save();
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// 사용자 ID를 세션에 저장
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// 세션에서 사용자 ID로 사용자 조회 (이메일 및 이름 포함해서 복원)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('name email');
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;