import { useState } from 'react';
import StarContainer from '../components/reviewpage/StarContainer';

const CinemaReviewPage = () => {
  const [starRate, setStarRate] = useState(0);

  const handleRating = (index: number) => {
    setStarRate(index);
  };

  console.log(starRate);

  return (
    <>
      <StarContainer handleRating={handleRating} />
    </>
  );
};

export default CinemaReviewPage;
