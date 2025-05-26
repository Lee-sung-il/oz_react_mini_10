import ky from "ky";

// 유틸 함수
function isAllowedMovie(movie: RawMovie): boolean {
    return !movie.adult &&
        !/(19금|19세|19|청불|청소년관람불가|R등급|18\+|porn|sex|sexual|erotic|nude|xxx|adult|섹스|야함|노출|선정)/i.test(
            movie.title + " " + movie.overview
        );
}

function toMovie(movie: RawMovie): Movie {
    return {
        id: movie.id,
        title: movie.title,
        rating: movie.vote_average,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    };
}

// TMDB API 응답 원형
type RawMovie = {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    adult: boolean;
    overview: string;
    genres: { id: number; name: string }[];
};

// 렌더링용 타입
export type Movie = {
    id: number;
    title: string;
    poster: string;
    rating: number;
};

export type MovieDetail = {
    id: number;
    title: string;
    overview: string;
    poster: string;
    vote_average: number;
    genres: string[];
};

type ApiResponse = {
    results: RawMovie[];
};

// 환경 변수
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

const api = ky.create({
    prefixUrl: BASE_URL,
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
});

// TMDB 인기 영화 가져오기 (페이지네이션 지원)
export async function fetchMovies(page: number): Promise<Movie[]> {
    const data = await api
        .get("movie/popular", {
            searchParams: {
                language: "ko-KR",
                page: page.toString(),
            },
        })
        .json<ApiResponse>();

    return data.results.filter(isAllowedMovie).map(toMovie);
}

export async function fetchMovieDetail(movieId: string): Promise<MovieDetail> {
    const data = await api
        .get(`movie/${movieId}`, {
            searchParams: {
                language: "ko-KR",
            },
        })
        .json<RawMovie>();

    return {
        id: data.id,
        title: data.title,
        overview: data.overview,
        vote_average: data.vote_average,
        poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        genres: data.genres.map((g) => g.name),
    };
}

// 영화 검색 (쿼리 기반)
export async function searchMovies(query: string): Promise<Movie[]> {
    if (!query.trim()) return [];

    const data = await api
        .get("search/movie", {
            searchParams: {
                language: "ko-KR",
                query,
                page: "1",
            },
        })
        .json<ApiResponse>();

    return data.results.filter(isAllowedMovie).map(toMovie);
}