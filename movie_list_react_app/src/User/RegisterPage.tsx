import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as React from "react";
import { supabase } from '../supabase/client';

interface FormInputProps {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    isDarkMode: boolean;
    autoComplete?: string;
}

function FormInput({ id, label, type, value, onChange, error, placeholder, isDarkMode, autoComplete }: FormInputProps) {
    return (
        <li>
            <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${
                    isDarkMode
                        ? 'bg-gray-700 text-white border-gray-600 focus:ring-yellow-500'
                        : 'bg-white border-gray-300 text-black focus:ring-red-500'
                }`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </li>
    );
}

export default function RegisterPage({ isDarkMode }: { isDarkMode: boolean }) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirm: ''
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = { name: '', email: '', password: '', confirm: '' };
        const nameRegex = /^[가-힣a-zA-Z0-9]{2,8}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (!nameRegex.test(name)) newErrors.name = '이름은 2~8자 한글, 영어, 숫자만 허용됩니다.';
        if (!emailRegex.test(email)) newErrors.email = '올바른 이메일 형식을 입력하세요.';
        if (!passwordRegex.test(password)) newErrors.password = '비밀번호는 영문자+숫자 조합이어야 합니다.';
        if (password !== confirm) newErrors.confirm = '비밀번호가 일치하지 않습니다.';

        setErrors(newErrors);
        if (Object.values(newErrors).some((msg) => msg)) return;

        // Debug payload values
        console.log('회원가입 시도:', { email, password, name });

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });

        if (error) {
          console.error('회원가입 실패:', error);
          setMessage(error.message || '회원가입 중 오류 발생');
        } else {
          console.log('회원가입 성공');
          setMessage('회원가입 성공! 이메일을 확인하세요.');
          navigate('/login');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`max-w-md mx-auto mt-16 p-8 shadow-lg rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <h1 className="text-3xl font-semibold mb-6 text-center">회원가입</h1>
            <ul className="space-y-4">
                <FormInput
                    id="name"
                    label="이름"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    placeholder="이름"
                    isDarkMode={isDarkMode}
                />
                <FormInput
                    id="email"
                    label="이메일"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    placeholder="이메일"
                    isDarkMode={isDarkMode}
                />
                <FormInput
                    id="password"
                    label="비밀번호"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    placeholder="비밀번호"
                    isDarkMode={isDarkMode}
                    autoComplete="new-password"
                />
                <FormInput
                    id="confirm"
                    label="비밀번호 확인"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    error={errors.confirm}
                    placeholder="비밀번호 확인"
                    isDarkMode={isDarkMode}
                    autoComplete="new-password"
                />
                <li>
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-red-700 text-white font-semibold py-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        회원가입
                    </button>
                </li>
                {message && (
                    <li className="text-center text-red-600 font-medium">{message}</li>
                )}
                <li className="text-sm text-center mt-2">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              이미 계정이 있으신가요?{' '}
                <a href="/login" className="text-blue-500 hover:underline">로그인</a>
            </span>
                </li>
            </ul>
        </form>
    );
}