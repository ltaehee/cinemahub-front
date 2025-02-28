import { genres } from "./genres";

export const seoConfig: {
  [key: string]: { title: string; description: string };
} = {
  "/": {
    title: "CinemaHub",
    description:
      "영화검색, 일간, 주간 트렌드 영화, 영화 평가 글쓰기가 가능한 홈페이지입니다.",
  },
  ...Object.fromEntries(
    genres.map(({ id, name }) => [
      `/genre/${id}`,
      {
        title: `${name} 영화 | CinemaHub`,
        description: `${name} 장르의 영화를 확인하세요.`,
      },
    ])
  ),
};
