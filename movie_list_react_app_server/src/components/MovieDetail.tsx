import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { fetchMovieDetail } from '../Data/MovieData';
import type { MovieDetail } from '../Data/MovieData';
import {TypeAnimation} from "react-type-animation";
import {LoadingPage} from "../Loading/LoadingPage.tsx";

export default function MovieDetail({ isDarkMode }: { isDarkMode: boolean }) {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<{ email: string } | null | undefined>(undefined);
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/current-user', { credentials: 'include' })
            .then(async (res) => {
                if (!res.ok) {
                    setUser(null);
                    navigate('/login', { state: { from: location.pathname } });
                } else {
                    const data = await res.json();
                    setUser(data.user);
                }
            })
            .catch(() => {
                setUser(null);
                navigate('/login', { state: { from: location.pathname } });
            });
    }, [navigate, location.pathname]);

    useEffect(() => {
        if (user === undefined || !movieId) return;
        if (user === null) {
            setLoading(false);
            return;
        }
        fetchMovieDetail(movieId)
            .then(setMovie)
            .finally(() => setLoading(false));
    }, [movieId, user]);

    if (loading) {
        return <LoadingPage message="영화 정보를 불러오는 중..." />;
    }
    if (user === null) {
        return null;
    }
    if (!movie) return <div>영화 정보를 불러올 수 없습니다.</div>;

    return (
        <div className={`flex justify-center items-center min-h-screen px-4 py-16 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} ${!isDarkMode ? 'text-black' : ''}`}>
            <div className="max-w-4xl w-full p-8 flex flex-col md:flex-row gap-10 items-start md:items-center">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full md:w-[400px] md:h-[600px] rounded-lg shadow-md object-cover"
                />
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                    <p className="text-lg font-semibold mb-3">평점: {movie.vote_average.toFixed(1)}</p>
                    <span className="pb-10 mb-10">장르</span>
                    <div className="flex flex-wrap gap-2 my-4 mb-4">

                        {movie.genres.map((genre) => (
                            <span
                                key={genre}
                                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-1 rounded-full text-sm"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                    <hr className="my-4" />
                    <span>줄거리</span>
                    <TypeAnimation
                        sequence={[
                            movie.overview || '줄거리 정보가 제공되지 않았습니다.',
                            1000, // 대기 시간(ms)
                        ]}
                        speed={1}
                        wrapper="p"
                        className="my-4 leading-relaxed"
                        cursor={true}
                    />
                </div>
            </div>
        </div>
    );
}