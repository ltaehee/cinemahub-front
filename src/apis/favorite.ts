import { baseInstance } from './axios.config';

/* 즐겨찾기 상태체크 */
export const checkFavoriteAPI = async (
  favoriteType: string,
  favoriteId: string
) => {
  const response = await baseInstance.get(`/favorite/check`, {
    params: {
      favoriteType,
      favoriteId,
    },
  });
  return response.data;
};
/* 즐겨찾기 추가 */
export const addFavoriteAPI = async (
  favoriteType: string,
  favoriteId: string
) => {
  const response = await baseInstance.post(`/favorite/add`, {
    favoriteType,
    favoriteId,
  });
  return response.data;
};
/* 즐겨찾기 삭제 */
export const removeFavoriteAPI = async (
  favoriteType: string,
  favoriteId: string
) => {
  const response = await baseInstance.post(`/favorite/remove`, {
    favoriteType,
    favoriteId,
  });
  return response.data;
};

/* 즐겨찾기 영화 페이지네이션  */
export const getFavoriteMoviesAPI = async (
  nickname: string,
  page: number,
  limit: number
) => {
  try {
    const response = await baseInstance.get(`/favorite/movies/${nickname}`, {
      params: {
        page,
        limit,
      },
    });
    console.log('즐겨찾기 영화', response.data);
    return response.data;
  } catch (err) {
    alert('즐겨찾기 영화 조회 에러 새로고침 해주세요');
  }
};

/* 즐겨찾기 영화인 페이지네이션  */
export const getFavoritePersonsAPI = async (
  nickname: string,
  page: number,
  limit: number
) => {
  try {
    const response = await baseInstance.get(`/favorite/persons/${nickname}`, {
      params: {
        page,
        limit,
      },
    });
    console.log('즐겨찾기 영화인', response.data);
    return response.data;
  } catch (err) {
    alert('즐겨찾기 영화인 조회 에러 새로고침 해주세요');
  }
};
