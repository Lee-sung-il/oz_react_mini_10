import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Autoplay} from 'swiper/modules';
import {useEffect, useState} from "react";

// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/navigation';
import {fetchMovies} from "../Data/MovieData.ts";
import {Link} from "react-router-dom";
import {LoadingPage} from "../Loading/LoadingPage.tsx";


type Movie = {
    id: number;
    title: string;
    poster: string;
    rating: number;
};

export default function MovieSliderPage({ isDarkMode }: { isDarkMode: boolean }) {
    const [movieSlider, setMovieSlider] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMovies()
            .then(setMovieSlider)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <LoadingPage message="영화 슬라이드를 불러오는 중..."/>;
    }

    return (
        <>

            <div className={`w-screen h-screen flex flex-col overflow-auto ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <div className="flex-1 flex items-center m-0 p-0">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={40}
                        slidesPerView={1}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        pagination={false}
                        className="w-full h-full flex-1 relative"
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                    >
                        {movieSlider.map((movie) => (
                            <SwiperSlide key={movie.id} className="h-full flex justify-center items-center px-4">
                                <div className="flex flex-col justify-center items-center text-center">
                                    <Link to={`/details/${movie.id}`}>
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-full h-[70vh] object-cover mb-2"
                                    />
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="swiper-button-prev !text-white !w-10 !h-10 !bg-black/50 !rounded-full z-10" />
                    <div className="swiper-button-next !text-white !w-10 !h-10 !bg-black/50 !rounded-full z-10" />
                </div>
            </div>
        </>
    );
}