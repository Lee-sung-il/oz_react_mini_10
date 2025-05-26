import React, { useState } from 'react';
import ky, { HTTPError } from 'ky';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function LoginPage({ isDarkMode }: { isDarkMode: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  interface LocationState {
    from?: string;
  }
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from || '/';

  const { setUser } = useUser();


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    try {
      await ky.post('/api/login', {
        json: { email, password },
        credentials: 'include',
      });
      const { user } = await ky.get('/api/current-user', { credentials: 'include' }).json<{ user: { name: string; email: string } }>();
      setUser(user);
      setError('');
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        if (err instanceof HTTPError) {
          try {
            const { message } = await err.response.json();
            setError(message || '로그인 중 오류가 발생했습니다.');
          } catch {
            setError('로그인 중 알 수 없는 오류가 발생했습니다.');
          }
        } else {
          setError('서버와의 연결에 실패했습니다.');
        }
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
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
          {error && <li className="text-red-600 text-sm">{error}</li>}
          <li className="text-sm text-center mt-2">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              오즈회원이 처음이신가요?{' '}
              <a href="/register" className="text-blue-500 hover:underline">회원가입</a>
            </span>
          </li>
          <li className="text-center">
            <a
              href="http://localhost:8080/auth/google"
              className="inline-block w-full bg-white text-black border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
            >
              Google 계정으로 로그인
            </a>
          </li>
          <li className="text-center">
            <a
              href="http://localhost:8080/auth/kakao"
              className="inline-block w-full bg-yellow-400 text-black border border-gray-300 px-4 py-2 rounded hover:bg-yellow-300"
            >
              Kakao 계정으로 로그인
            </a>
          </li>
        </ul>
      </form>
    </div>
  );
}
