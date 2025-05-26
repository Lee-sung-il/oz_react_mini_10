import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Autoplay, EffectCoverflow} from 'swiper/modules';
import {useEffect, useState} from "react";



import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/effect-coverflow";
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
        fetchMovies(1)
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
                <div className="flex-1 flex items-center justify-center p-4">
                    <Swiper
                        modules={[Navigation, Autoplay, EffectCoverflow]}
                        spaceBetween={40}
                        slidesPerView={3}
                        breakpoints={{
                          0: { slidesPerView: 1 },
                          768: { slidesPerView: 2 },
                          1024: { slidesPerView: 3 },
                        }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        pagination={false}
                        className="w-full h-full flex-1 relative"
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        effect="coverflow"
                        centeredSlides={true}
                        loop={true}
                        coverflowEffect={{
                          rotate: 50,
                          stretch: 0,
                          depth: 100,
                          modifier: 1,
                          slideShadows: false,
                        }}
                    >
                        {movieSlider.map((movie) => (
                            <SwiperSlide key={movie.id} className="w-full flex justify-center items-center">
                                <div className="flex flex-col justify-center items-center text-center">
                                    <Link to={`/details/${movie.id}`}>
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-[98vw] md:w-[80%] lg:w-[70%] h-auto max-h-[65vh] object-contain mb-2"
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