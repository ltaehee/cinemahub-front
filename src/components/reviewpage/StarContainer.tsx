import { createContext, useContext, useState } from 'react';
import StarIcon from '../../icons/StarIcon';

const keyArr = Array.from({ length: 5 }, (_, i) => i + 1);

interface StarContainerProps {
  starRate?: number;
  handleRating: (index: number) => void;
  defaultStar?: number;
}

export interface StarContextType {
  rating?: number;
  painting?: number;
}

const StarContext = createContext<StarContextType>({
  rating: 0,
  painting: 0,
});

export const useStarContext = () => {
  const context = useContext(StarContext);
  if (!context) {
    throw new Error('StarContext 내부에서 호출가능');
  }
  return context;
};

const StarContainer = (props: StarContainerProps) => {
  const { starRate, handleRating, defaultStar = 0 } = props;

  const [painting, setPainting] = useState<number>(0);

  const handleMouseOverIndex = (index: number) => {
    setPainting(index);
    handleRating(index);
  };

  const handleMouseOutIndex = () => {
    setPainting(0); // index와 rating 비교
  };

  const handleClickIndex = (index: number) => {
    handleRating(index);
  };

  const starcontext = defaultStar
    ? { rating: defaultStar }
    : { rating: starRate, painting };

  return (
    <>
      {defaultStar ? (
        <div className="flex">
          {keyArr.map((key, index) => (
            <StarContext.Provider key={key} value={starcontext}>
              <StarIcon index={index} />
            </StarContext.Provider>
          ))}
        </div>
      ) : (
        <div className="flex">
          {keyArr.map((key, index) => (
            <StarContext.Provider key={key} value={starcontext}>
              <StarIcon
                className="cursor-pointer"
                index={index}
                onClick={() => handleClickIndex(key)}
                onMouseOver={() => handleMouseOverIndex(key)}
                onMouseOut={handleMouseOutIndex}
              />
            </StarContext.Provider>
          ))}
        </div>
      )}
    </>
  );
};

export default StarContainer;
