import { useEffect, useState } from 'react';
import LikeIcon from '../../icons/LikeIcon';
import UnlikeIcon from '../../icons/UnlikeIcon';
import { useCommentContext } from './comment';

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

  const handleLikeUnLike = (type: string) => {
    switch (type) {
      case 'like':
        setLikes((prev) => ({ ...prev, like: true, unlike: false }));
        return;
      case 'unlike':
        setLikes((prev) => ({ ...prev, like: false, unlike: true }));
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
