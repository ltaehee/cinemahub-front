import { useState } from 'react';
import StarContainer from '../components/reviewpage/StarContainer';

const defaultStar = 3;

const CinemaReviewPage = () => {
  const [starRate, setStarRate] = useState(0);

  const handleRating = (index: number) => {
    setStarRate(index);
  };

  console.log(starRate);

  return (
    <>
      <div>
        <StarContainer handleRating={handleRating} defaultStar={0} />
      </div>

      <div>
        <StarContainer handleRating={handleRating} defaultStar={defaultStar} />
      </div>
    </>
  );
};

export default CinemaReviewPage;
