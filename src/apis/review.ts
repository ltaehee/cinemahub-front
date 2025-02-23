import { AxiosError } from 'axios';
import { baseInstance } from './axios.config';
import { emptyChecker } from '../util/emptyCheck';

type Review = {
  movieId: string;
  image: string;
  content: string;
  starpoint: number;
};

type likesType = {
  like: boolean;
  unlike: boolean;
};

export const RegisterReviewFetch = async ({
  movieId,
  image,
  content,
  starpoint,
}: Review) => {
  if (emptyChecker({ movieId, image, content, starpoint })) {
    alert('별점과 리뷰 내용을 적어주세요.');
    return;
  }

  try {
    const response = await baseInstance.post('/review/register', {
      movieId,
      image,
      content,
      starpoint,
    });

    if (response.data.isError) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

export const getMovieidCommentArrayFetch = async ({
  movieId,
}: Pick<Review, 'movieId'>) => {
  if (emptyChecker({ movieId })) {
    alert('리뷰를 작성할 영화 정보를 조회할 수 없어요.');
    return;
  }

  try {
    const response = await baseInstance.post(`/review/totalcomments`, {
      movieId,
    });

    if (response.data.isError) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

export const getLikesNumber = async ({
  commentId,
  likes,
}: {
  commentId: string;
  likes: likesType;
}) => {
  if (emptyChecker({ commentId })) {
    throw new Error('댓글을 참조할 수 없습니다. 새로고침 해주세요.');
  }

  if (likes.like === false && likes.unlike === false) {
    throw new Error('알 수 없는 에러가 발생했어요. 새로고침 해주세요.');
  }
  try {
    const response = await baseInstance.post(`/review/likes`, {
      commentId,
      likes,
    });

    if (response.data.isError) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};
