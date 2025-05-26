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
  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation();

  type UserWithName = { name: string; email: string };
  const typedUser = user as UserWithName | null;
  const userName = typedUser?.name || '';

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
        setShowDropdown(false);
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
    <nav className={`relative z-50 p-4 shadow-md ${isDarkMode ? 'bg-gray-300 text-black' : 'bg-gray-900 text-white'}`}>
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
            {typedUser ? (
              <div className="relative">
                <div
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z" />
                  </svg>
                </div>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white text-black shadow-lg rounded-md">
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">마이 페이지</button>
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
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
              {typedUser ? (
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <button className="hover:text-yellow-400">마이 페이지</button>
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="hover:text-yellow-400"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-1">
                  <button onClick={goToLogin} className="hover:text-yellow-400">로그인</button>
                  <button onClick={goToRegister} className="hover:text-yellow-400">회원가입</button>
                </div>
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