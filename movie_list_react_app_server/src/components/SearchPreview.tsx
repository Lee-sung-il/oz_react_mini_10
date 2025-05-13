import type { Movie } from '../Data/MovieData';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchMovies } from '../Data/MovieData';
import MovieCard from './MovieCard';

export default function SearchPreview({ isDarkMode }: { isDarkMode: boolean }) {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [results, setResults] = useState<Movie[]>([]);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        searchMovies(query)
            .then(setResults)
            .catch((err) => {
                console.error(err);
                setResults([]);
            });
    }, [query]);

    return (
        <div className={`p-6 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <h2 className="text-2xl font-bold mb-4">🔍 검색 결과</h2>
            {!query && <p className="text-gray-500">검색어를 입력해주세요.</p>}
            {query && (
                results.length === 1 ? (
                    <div className="flex justify-center">
                        <div className="max-w-sm w-full">
                            <MovieCard isDarkMode={isDarkMode} {...results[0]} />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
                        {results.map((movie) => (
                            <div key={movie.id} className="flex flex-col h-full">
                              <MovieCard isDarkMode={isDarkMode} {...movie} />
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
