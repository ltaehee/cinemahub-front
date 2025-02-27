import { AxiosError } from 'axios';
import { baseInstance } from './axios.config';
import { emptyChecker } from '../util/emptyCheck';

type Review = {
  movieId: string;
  imgUrls: string[];
  content: string;
  starpoint: number;
};

type likesType = {
  like: boolean;
  dislike: boolean;
};

export const RegisterReviewFetch = async ({
  movieId,
  imgUrls,
  content,
  starpoint,
}: Review) => {
  if (emptyChecker({ movieId, imgUrls, content, starpoint })) {
    alert('별점과 리뷰 내용을 적어주세요.');
    return;
  }

  try {
    const response = await baseInstance.post('/review/register', {
      movieId,
      imgUrls,
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

    if (response.status === 404) {
      return response.data;
    }

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

export const getLikesFetch = async ({
  commentId,
  likes,
}: {
  commentId: string;
  likes: likesType;
}) => {
  if (emptyChecker({ commentId })) {
    throw new Error('댓글을 참조할 수 없습니다. 새로고침 해주세요.');
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
      alert(err.response.data.message);
    }
    throw err;
  }
};

export const RegisterReportFetch = async ({
  commentId,
  reason,
}: {
  commentId: string;
  reason: string;
}) => {
  if (emptyChecker({ commentId })) {
    throw new Error('댓글을 참조할 수 없습니다. 새로고침 해주세요.');
  }

  try {
    const response = await baseInstance.post(`/review/report`, {
      commentId,
      reason,
    });

    if (response.data.isError) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err.response.data.message);
      alert(err.response.data.message);
    }
    throw err;
  }
};

export const deleteReviewFetch = async ({
  commentId,
}: {
  commentId: string;
}) => {
  if (emptyChecker({ commentId })) {
    throw new Error('댓글을 참조할 수 없습니다. 새로고침 해주세요.');
  }

  try {
    const response = await baseInstance.post(`/review/delete`, {
      commentId,
    });

    if (response.data.isError) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err.response.data.message);
      alert(err.response.data.message);
    }
    throw err;
  }
};
