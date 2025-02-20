import { useState } from 'react';
import StarIcon from '../../icons/StarIcon';

const keyArr = Array.from({ length: 5 }, (_, i) => i + 1);

interface StarContainerProps {
  handleRating: (index: number) => void;
  defaultStar?: number;
}

const StarContainer = (props: StarContainerProps) => {
  const { handleRating, defaultStar = 0 } = props;

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
  };

  return (
    <>
      {defaultStar ? (
        <div className="flex">
          {keyArr.map((key, index) => (
            <StarIcon
              className="cursor-pointer"
              key={key}
              index={index}
              rating={defaultStar}
            />
          ))}
        </div>
      ) : (
        <div className="flex">
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
        </div>
      )}
    </>
  );
};

export default StarContainer;
