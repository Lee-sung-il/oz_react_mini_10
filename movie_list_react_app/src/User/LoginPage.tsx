import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useUser } from '../context/UserContext';

export default function LoginPage({ isDarkMode }: { isDarkMode: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();
  const from = (location.state as { from?: string })?.from || '/';

  const handleOAuthLogin = async (provider: 'google' | 'kakao') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(`${provider} 로그인 실패: ${error.message}`);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
    } else if (data?.user) {
      setUser({ email: data.user.email! });
      navigate(from, { replace: true });
    }
  }

  return (
    <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <form onSubmit={handleSubmit} className={`w-full max-w-md md:max-w-lg p-8 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800 border border-gray-600' : 'bg-white border border-gray-300'}`}>
        <h1 className="text-3xl font-semibold mb-6 text-center">Sign in</h1>
        <ul className="space-y-4">
          <li>
            <label htmlFor="email" className={`block mb-1 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setError('');
              }}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 text-white border-gray-500 placeholder-gray-400 focus:ring-yellow-500' : 'bg-white text-black border-gray-300 focus:border-red-600 focus:ring-red-500'}`}
              placeholder="you@example.com"
            />
          </li>
          <li>
            <label htmlFor="password" className={`block mb-1 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError('');
              }}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 text-white border-gray-500 placeholder-gray-400 focus:ring-yellow-500' : 'bg-white text-black border-gray-300 focus:border-red-600 focus:ring-red-500'}`}
              placeholder="Your password"
            />
          </li>
          <li>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Sign In
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Google로 로그인
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleOAuthLogin('kakao')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              Kakao로 로그인
            </button>
          </li>
          {error && <li className="text-red-600 text-sm">{error}</li>}
          <li className="text-sm text-center mt-2">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              오즈회원이 처음이신가요?{' '}
              <a href="/register" className="text-blue-500 hover:underline">회원가입</a>
            </span>
          </li>
        </ul>
      </form>
    </div>
  );
}
