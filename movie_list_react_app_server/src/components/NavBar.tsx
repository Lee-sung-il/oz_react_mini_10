import { useState, useEffect } from 'react';
import {Link, useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {useDebounce} from "../hooks/useDebounce.ts";
import { useUser } from '../context/UserContext';

export default function NavBar({ isDarkMode, toggleDarkMode }: { isDarkMode: boolean; toggleDarkMode: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 500);

  const location = useLocation();

  const userName = user?.email?.split('@')[0] || '';

  // Fetch current user on mount
  useEffect(() => {
    fetch('/api/current-user', { credentials: 'include' })
      .then(async res => {
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        console.log('User loaded:', data.user);
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const goToRegister = () => {
    navigate('/register', { state: { from: location.pathname } });
  };

  const goToLogin = () => {
    navigate('/login', { state: { from: location.pathname } });
    console.log(location.pathname)
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed) {
      navigate(`/search?query=${encodeURIComponent(trimmed)}`, { replace: true });
    } else {
      if (location.pathname === '/search') {
        navigate('/', { replace: true });
      }
    }
  }, [debouncedSearch]);

  return (
    <nav className={`p-4 shadow-md ${isDarkMode ? 'bg-gray-300 text-black' : 'bg-gray-900 text-white'}`}>
        <div className="container mx-auto flex items-center justify-between">
          {/* 로고 */}
          <div className="text-xl font-bold">
            <Link to="/">OZ무비</Link>
          </div>

          {/* 햄버거 버튼 (모바일용) */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isDarkMode ? 'text-black' : 'text-white'} focus:outline-none`}
            >
              ☰
            </button>
          </div>

          {/* 검색창 (중간) */}
          <div className="hidden lg:flex flex-1 justify-center px-4">
            <input
              type="text"
              placeholder="영화 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full max-w-md px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-gray-100 text-black'
              }`}
            />
          </div>

          {/* 링크 (데스크탑용) */}
          <div className="hidden lg:flex space-x-4 items-center">
            <Link to="/" className="hover:text-yellow-400">Home</Link>
            {user ? (
              <>
                <span>{userName && `${userName}님`}</span>
                <button onClick={logout} className="hover:text-yellow-400">로그아웃</button>
              </>
            ) : (
              <>
                <button onClick={goToLogin} className="block hover:text-yellow-400">로그인</button>
                <button onClick={goToRegister}>
                  회원가입
                </button>
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 (토글) */}
        {isOpen && (
          <div className="lg:hidden mt-4 space-y-2 text-center">
            <input
              type="text"
              placeholder="영화 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full max-w-xs mx-auto px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-gray-100 text-black'
              }`}
            />
            <div className="space-y-2">
              <Link to="/" className="block hover:text-yellow-400">Home</Link>
              {user ? (
                <div>
                  <span>{userName && `${userName}님`}</span>
                  <button onClick={logout} className="hover:text-yellow-400">로그아웃</button>
                </div>
              ) : (
                <>
                  <button onClick={goToLogin} className="block hover:text-yellow-400">로그인</button>
                  <button onClick={goToRegister} className="hover:text-yellow-400">회원가입</button>
                </>
              )}
            </div>
            <button
              onClick={toggleDarkMode}

            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        )}
      </nav>

  );
}