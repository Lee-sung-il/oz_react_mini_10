import { Link } from 'react-router-dom';

export default function MovieCard({ id, title, poster, rating, isDarkMode }: {
    id: number;
    title: string;
    poster: string;
    rating: number;
    isDarkMode: boolean;
}) {
    return (
        <Link to={`/details/${id}`}>
            <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} shadow-md rounded-lg overflow-hidden hover:scale-105 transition p-2`}>
                <div className="flex justify-center items-center h-96">
                    <img
                        src={poster}
                        alt={title}
                        className="max-h-[90%] object-contain"
                    />
                </div>
                <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{title}</h3>
                    <p className={`${isDarkMode ? 'text-yellow-300' : 'text-gray-700'} font-bold`}>⭐ {rating.toFixed(1)}</p>
                </div>
            </div>
        </Link>
    );
}