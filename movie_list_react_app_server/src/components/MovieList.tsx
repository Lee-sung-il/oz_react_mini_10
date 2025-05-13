import {useEffect, useState} from 'react';
import MovieCard from './MovieCard';
import {fetchMovies, Movie} from "../Data/MovieData.ts";
import {LoadingPage} from "../Loading/LoadingPage.tsx";
import MovieSliderPage from "./MovieSliderPage.tsx";

export default function MovieList({isDarkMode}: { isDarkMode: boolean }) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMovies()
            .then(setMovies)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
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
        <div className="w-screen h-screen overflow-auto mt-8">
            <div className="w-full h-[75vh] flex items-center justify-center">
                <div className="w-full h-full">
                    <MovieSliderPage isDarkMode={isDarkMode} />
                </div>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 auto-rows-fr">
                {movies.map((movie) => (
                    <div key={movie.id} className="h-full">
                        <MovieCard isDarkMode={isDarkMode} {...movie} />
                    </div>
                ))}
            </div>
        </div>
    );
}