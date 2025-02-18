import { useState } from 'react';
import StarIcon from '../../icons/StarIcon';

const keyArr = Array.from({ length: 5 }, (_, i) => i + 1);

interface StarContainer {
  handleRating: (index: number) => void;
}

const StarContainer = (props: StarContainer) => {
  const { handleRating } = props;

  const [painting, setPainting] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);

  const handleMouseOverIndex = (index: number) => {
    setPainting(index);
    handleRating(index);
  };

  const handleMouseOutIndex = () => {
    setPainting(0);
  };

  const handleClickIndex = (index: number) => {
    setRating(index);
    handleRating(index);
  };

  return (
    <>
      {keyArr.map((key, index) => (
        <StarIcon
          className="cursor-pointer"
          key={key}
          index={index}
          painting={painting}
          rating={rating}
          onClick={() => handleClickIndex(key)}
          onMouseOver={() => handleMouseOverIndex(key)}
          onMouseOut={handleMouseOutIndex}
        />
      ))}
    </>
  );
};

export default StarContainer;
