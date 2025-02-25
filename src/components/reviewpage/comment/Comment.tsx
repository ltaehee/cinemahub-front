import { useState } from 'react';
import { useCommentContext } from '.';
import ListIcon from '../../../icons/ListIcon';
import AspectRatio from '../AspectRatio';
import StarContainer from '../StarContainer';
import LikeComponent from '../LikeComponent';

const Comment = () => {
  const { comment } = useCommentContext();
  const [_, setStarRate] = useState(0);

  const handleRating = (index: number) => {
    setStarRate(index);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <StarContainer
          handleRating={handleRating}
          defaultStar={comment.starpoint}
        />
        <ListIcon className="mr-2" />
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div style={{ width: '60px' }}>
          <AspectRatio ratio={1 / 1}>
            <AspectRatio.Image src={comment.image} alt={'프로필 사진'} />
          </AspectRatio>
        </div>

        <p className="text-slate-400">{comment.userId.nickname}</p>
        <p className="text-slate-400">{comment.createdAt.split('T')[0]}</p>
      </div>

      <p className="mt-2">{comment.content}</p>
      <div className="mt-4">
        <LikeComponent />
      </div>
    </div>
  );
};

export default Comment;
