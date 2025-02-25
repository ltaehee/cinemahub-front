import { useEffect, useState } from 'react';
import LikeIcon from '../../icons/LikeIcon';
import UnlikeIcon from '../../icons/UnlikeIcon';
import { useCommentContext } from './comment';
import { emptyChecker } from '../../util/emptyCheck';
import { getLikesFetch } from '../../apis/review';

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
  const commentId = comment._id;

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
      const { result, message } = await getLikesFetch({
        commentId,
        likes,
      });

      if (!result) {
        throw new Error('좋아요/ 싫어요 등록 실패');
      }
      alert(message);
    } catch (e) {}
  };

  const handleLike = () => {
    //좋아요 취소
    if (likes.like) {
      setLikes({ like: false, dislike: false });
      handleLikesFetch({ commentId, likes: { like: false, dislike: false } });
      return;
    }
    setLikes({ like: true, dislike: false });
    handleLikesFetch({ commentId, likes: { like: true, dislike: false } });
  };

  const handleUnLike = () => {
    //싫어요 취소
    if (likes.dislike) {
      setLikes({ like: false, dislike: false });
      handleLikesFetch({ commentId, likes: { like: false, dislike: false } });
      return;
    }
    setLikes({ like: false, dislike: true });
    handleLikesFetch({ commentId, likes: { like: false, dislike: true } });
  };

  useEffect(() => {
    setLikes((prev) => ({
      ...prev,
      like: comment.like,
      dislike: comment.dislike,
    }));
  }, [comment]);

  return (
    <>
      <div className="flex gap-3">
        <div
          className={`flex items-center gap-2 bg-[#D1D1D1] hover:bg-[#BDBDBD] p-[8px] rounded-[5px] transition`}
          onClick={() => handleLike()}
        >
          <LikeIcon recomm={likes.like} />
          <span>{comment.totalLike}</span>
        </div>
        <div
          className={`flex items-center gap-2 bg-[#D1D1D1] hover:bg-[#BDBDBD] p-[8px] rounded-[5px] transition`}
          onClick={() => handleUnLike()}
        >
          <UnlikeIcon recomm={likes.dislike} />
          <span>{comment.totalDisLike}</span>
        </div>
      </div>
    </>
  );
};

export default LikeComponent;
