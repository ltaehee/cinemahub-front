import { ReactNode, useContext, useEffect, useMemo } from "react";
import { CarouselInfiniteContext } from ".";
import { carouselInfiniteNavigatorCls } from "@consts/className";

interface CarouselInfiniteNavigatorProps {
  className?: string;
  children?: (
    prev: () => void,
    next: () => void,
    displayIndex: number,
    itemLength: number
  ) => ReactNode;
}

const CarouselInfiniteNavigator = (props: CarouselInfiniteNavigatorProps) => {
  const { className, children } = props;
  const {
    itemLength,
    setCarouselIndex,
    carouselIndex,
    setTransition,
    displayIndex,
  } = useContext(CarouselInfiniteContext);

  const extendeditemLength = itemLength + 2;

  const handlePrev = () => {
    setCarouselIndex(
      (prevIndex) => (prevIndex - 1 + extendeditemLength) % extendeditemLength
    );
    setTransition(true);
  };

  const handleNext = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % extendeditemLength);
    setTransition(true);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (carouselIndex === 0) {
      timeoutId = setTimeout(() => {
        setTransition(false);
        setCarouselIndex(itemLength);
      }, 500);
    } else if (carouselIndex === itemLength + 1) {
      timeoutId = setTimeout(() => {
        setTransition(false);
        setCarouselIndex(1);
      }, 500);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [carouselIndex, itemLength]);

  const cls = useMemo(
    () =>
      className
        ? `${className} ${carouselInfiniteNavigatorCls}`
        : carouselInfiniteNavigatorCls,
    [className]
  );

  return (
    <div className={cls}>
      {children && typeof children === "function" ? (
        children(handlePrev, handleNext, displayIndex, itemLength)
      ) : (
        <>
          <button onClick={handlePrev}> &lt;</button>
          <div>
            {displayIndex}/{itemLength}
          </div>
          <button onClick={handleNext}> &gt;</button>
        </>
      )}
    </div>
  );
};

export default CarouselInfiniteNavigator;
