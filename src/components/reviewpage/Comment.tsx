import { useState } from 'react';
import ListIcon from '../../icons/ListIcon';
import AspectRatio from './AspectRatio';
import LikeComponent from './LikeComponent';
import StarContainer from './StarContainer';

const defaultStar = 3;
const reviewContent = '리뷰내용';

const Comment = () => {
  const [starRate, setStarRate] = useState(0);

  const handleRating = (index: number) => {
    setStarRate(index);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <StarContainer handleRating={handleRating} defaultStar={defaultStar} />

        <ListIcon className="mr-2" />
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div style={{ width: '60px' }}>
          <AspectRatio ratio={1 / 1}>
            <AspectRatio.Image src={''} alt={'프로필 사진'} />
          </AspectRatio>
        </div>

        <p className="text-slate-400">닉네임</p>
        <p className="text-slate-400">2025년 2월 12일</p>
      </div>

      <p className="mt-2">{reviewContent}</p>

      <div className="mt-2">
        <LikeComponent />
      </div>
    </div>
  );
};

export default Comment;
