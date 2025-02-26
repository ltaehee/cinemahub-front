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

      <div className="mt-2 flex gap-2">
        {comment.imgUrls.map((src, index) => (
          <div
            key={`image-src-${index}`}
            className="relative w-[150px] h-full rounded-[5px] border border-[#DDDDDD]"
          >
            <AspectRatio ratio={1 / 1}>
              <AspectRatio.Image
                className="w-full h-full"
                src={src}
                alt={'리뷰 사진'}
              />
            </AspectRatio>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div className="w-[36px]">
          <AspectRatio ratio={1 / 1}>
            <AspectRatio.Image
              className="rounded-[18px]"
              src={comment.userId.profile}
              alt={'리뷰 사진'}
            />
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
