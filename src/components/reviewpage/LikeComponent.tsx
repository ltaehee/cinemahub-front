import { useEffect, useState } from 'react';
import LikeIcon from '../../icons/LikeIcon';
import UnlikeIcon from '../../icons/UnlikeIcon';
import { useCommentContext } from './comment';
import { emptyChecker } from '../../util/emptyCheck';
import { getLikesFetch } from '../../apis/review';
import useLikeDebounce from '../../hooks/useLikeDebounce';

type CommentType = {
  _id: string;
  userId: UserType;
  content: string;
  createdAt: string;
  imgUrls: string[];
  starpoint: number;
  like: boolean;
  dislike: boolean;
  totalLike: number;
  totalDisLike: number;
  IsOwner: boolean;
  deletedAt: string;
};

type UserType = {
  nickname: string;
  profile: string;
  _id: string;
};

type likesType = {
  like: boolean;
  dislike: boolean;
};

const defaultLikes = {
  like: false,
  dislike: false,
};

const LikeComponent = () => {
  const { comment } = useCommentContext();
  const [likes, setLikes] = useState<likesType>(defaultLikes);
  const [updateComment, setUpdateComment] = useState<CommentType>(comment);

  const commentId = updateComment._id;

  const handleLikesFetch = async ({
    commentId,
    likes,
  }: {
    commentId: string;
    likes: likesType;
  }) => {
    if (emptyChecker({ commentId })) {
      throw new Error(
        '리뷰를 참조할 수 없습니다. 웹 페이지를 새로고침 해주세요.'
      );
    }

    try {
      const { result, data, message } = await getLikesFetch({
        commentId,
        likes,
      });

      if (!result) {
        throw new Error('좋아요/싫어요 등록 실패');
      }

      setUpdateComment((prev) => ({
        ...prev,
        like: data.like,
        dislike: data.dislike,
        totalLike: data.totalLike,
        totalDisLike: data.totalDisLike,
      }));

      setLikes((prev) => ({ ...prev, like: data.like, dislike: data.dislike }));
      alert(message);
    } catch (e) {}
  };

  const handleLike = () => {
    //좋아요 취소
    if (likes.like) {
      handleLikesFetch({ commentId, likes: { like: false, dislike: false } });
      return;
    }
    setLikes({ like: true, dislike: false });
    handleLikesFetch({ commentId, likes: { like: true, dislike: false } });
  };

  const handleUnLike = () => {
    //싫어요 취소
    if (likes.dislike) {
      handleLikesFetch({ commentId, likes: { like: false, dislike: false } });
      return;
    }
    setLikes({ like: false, dislike: true });
    handleLikesFetch({ commentId, likes: { like: false, dislike: true } });
  };

  useEffect(() => {
    setLikes({
      like: updateComment.like,
      dislike: updateComment.dislike,
    });
  }, []);

  const debounce = useLikeDebounce();
  const likeDebounce = debounce(handleLike, 1000);
  const dislikeDebounce = debounce(handleUnLike, 1000);

  return (
    <>
      <div className="flex gap-3">
        <div
          className={`flex items-center gap-2 bg-[#D1D1D1] hover:bg-[#BDBDBD] p-[8px] rounded-[5px] transition`}
          onClick={likeDebounce}
        >
          <LikeIcon recomm={likes.like} />
          <span>{updateComment.totalLike}</span>
        </div>
        <div
          className={`flex items-center gap-2 bg-[#D1D1D1] hover:bg-[#BDBDBD] p-[8px] rounded-[5px] transition`}
          onClick={dislikeDebounce}
        >
          <UnlikeIcon recomm={likes.dislike} />
          <span>{updateComment.totalDisLike}</span>
        </div>
      </div>
    </>
  );
};

export default LikeComponent;
