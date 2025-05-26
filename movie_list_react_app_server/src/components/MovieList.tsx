import {useEffect, useState} from 'react';
import MovieCard from './MovieCard';
import {fetchMovies, Movie} from "../Data/MovieData.ts";
import {LoadingPage} from "../Loading/LoadingPage.tsx";
import MovieSliderPage from "./MovieSliderPage.tsx";

export default function MovieList({isDarkMode}: { isDarkMode: boolean }) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const loadMovies = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const newMovies = await fetchMovies(page);
            setMovies(prev => {
                const ids = new Set(prev.map(m => m.id));
                const uniqueNew = newMovies.filter(m => !ids.has(m.id));
                return [...prev, ...uniqueNew];
            });
            setPage(prev => prev + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMovies();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
            if (nearBottom) {
                loadMovies();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page, loading]);

    if (loading && movies.length === 0) {
        return <LoadingPage message="영화 데이터를 불러오는 중입니다..."/>;
    }

    if (movies.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>표시할 영화가 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="w-screen min-h-screen overflow-auto mt-2">
            <div className="w-full h-[60vh] flex items-center justify-center">
                <div className="w-full h-full">
                    <MovieSliderPage isDarkMode={isDarkMode} />
                </div>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 auto-rows-fr relative z-10">
                {movies.map((movie) => (
                    <div key={movie.id} className="h-full">
                        <MovieCard isDarkMode={isDarkMode} {...movie} />
                    </div>
                ))}
            </div>
            {loading && (
                <div className="text-center py-4 text-gray-500">로딩 중...</div>
            )}
        </div>
    );
}