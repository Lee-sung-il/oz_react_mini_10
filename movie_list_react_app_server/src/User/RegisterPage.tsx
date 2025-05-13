import { useState } from 'react';
import { useUser } from '../context/UserContext';
import ky, { HTTPError } from 'ky';
import { useNavigate, useLocation } from 'react-router-dom';
import * as React from "react";

export default function RegisterPage({ isDarkMode }: { isDarkMode: boolean }) {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [message, setMessage] = useState('');
    const { setUser } = useUser();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirm) {
            setMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await ky.post('/api/register', {
                json: { email: email, password },
                credentials: 'include',
            });
            // Fetch current user after successful registration and update context
            const response = await ky.get('/api/current-user', { credentials: 'include' }).json();
            interface User {
                id: string;
                email: string;
                // Add other fields as needed from your backend
            }
            const user = (response as { user: User }).user;
            setUser(user);
            setMessage('회원가입 성공!');
            navigate(from);
        } catch (err) {
            if (err instanceof HTTPError) {
                const errorData = await err.response.json();
                setMessage(errorData.message || '회원가입 중 오류 발생');
            } else {
                setMessage('알 수 없는 오류');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`max-w-md mx-auto mt-16 p-8 shadow-lg rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">이메일</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일"
                    className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-red-600 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300 text-black'}`}
                    required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">비밀번호</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-red-600 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300 text-black'}`}
                    required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="confirm" className="block text-gray-700 font-semibold mb-2">비밀번호 확인</label>
                <input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="비밀번호 확인"
                    className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-red-600 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300 text-black'}`}
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-3 rounded hover:bg-red-700 transition-colors duration-200"
            >
                회원가입
            </button>
            {message && (
                <p className="mt-6 text-center text-red-600 font-medium">
                    {message}
                </p>
            )}
        </form>
    );
}