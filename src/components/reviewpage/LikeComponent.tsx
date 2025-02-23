import { useEffect, useState } from 'react';
import LikeIcon from '../../icons/LikeIcon';
import UnlikeIcon from '../../icons/UnlikeIcon';
import { useCommentContext } from './comment';
import { emptyChecker } from '../../util/emptyCheck';
import { getLikesNumber } from '../../apis/review';

type likesType = {
  like: boolean;
  unlike: boolean;
};

const defaultLikes = {
  like: false,
  unlike: false,
};

const LikeComponent = () => {
  const [likes, setLikes] = useState<likesType>(defaultLikes);

  const { comment } = useCommentContext();
  const commentId = comment._id;

  const handleLikesNumber = async ({
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

    if (likes.like === false && likes.unlike === false) {
      throw new Error('알 수 없는 에러가 발생했어요. 새로고침 해주세요.');
    }

    try {
      const { result, data, message } = await getLikesNumber({
        commentId,
        likes,
      });
      if (!result) {
      }
      setLikes((prev) => ({
        ...prev,
        like: data.like,
        unlike: data.dislike,
      }));
      alert(message);
    } catch (e) {}
  };

  const handleLikeUnLike = (type: string) => {
    switch (type) {
      case 'like':
        setLikes((prev) => ({ ...prev, like: true, unlike: false }));

        if (likes.like) {
          alert('이미 좋아요를 눌렀어요.');
          return;
        }

        handleLikesNumber({ commentId, likes });
        return;
      case 'unlike':
        setLikes((prev) => ({ ...prev, like: false, unlike: true }));

        if (likes.unlike) {
          alert('이미 싫어요를 눌렀어요.');
          return;
        }
        handleLikesNumber({ commentId, likes });
        return;
      default:
        return;
    }
  };

  useEffect(() => {
    setLikes((prev) => ({
      ...prev,
      like: comment.like,
      unlike: comment.dislike,
    }));
  }, []);

  return (
    <>
      <div className="flex gap-3">
        <div
          className={`flex items-center gap-2 bg-[#D1D1D1] hover:bg-[#BDBDBD] p-[8px] rounded-[5px] transition`}
          onClick={() => handleLikeUnLike('like')}
        >
          <LikeIcon recomm={likes.like} />
          <span>{comment.totalLike}</span>
        </div>
        <div
          className={`flex items-center gap-2 bg-[#D1D1D1] hover:bg-[#BDBDBD] p-[8px] rounded-[5px] transition`}
          onClick={() => handleLikeUnLike('unlike')}
        >
          <UnlikeIcon recomm={likes.unlike} />
          <span>{comment.totalUnlike}</span>
        </div>
      </div>
    </>
  );
};

export default LikeComponent;
