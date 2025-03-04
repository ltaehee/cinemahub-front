import { ReactNode, useContext, useEffect, useMemo } from "react";
import { CarouselInfiniteContext } from ".";
import { carouselInfiniteNavigatorCls } from "@consts/className";

interface CarouselInfiniteNavigatorProps {
  className?: string;
  children?: (
    prev: () => void,
    next: () => void,
    displayIndex: number,
    itemLength: number,
    isTransitioning: boolean
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
    handlePrev,
    handleNext,
    isTransitioning,
    setIsTransitioning,
  } = useContext(CarouselInfiniteContext);

  useEffect(() => {
    if (carouselIndex === 0 || carouselIndex === itemLength + 1) {
      const targetIndex = carouselIndex === 0 ? itemLength : 1;

      setTimeout(() => {
        setTransition(false);
        setCarouselIndex(targetIndex);
        setIsTransitioning(false);
      }, 500);
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  }, [
    carouselIndex,
    itemLength,
    setCarouselIndex,
    setTransition,
    setIsTransitioning,
  ]);

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
        children(
          handlePrev,
          handleNext,
          displayIndex,
          itemLength,
          isTransitioning
        )
      ) : (
        <>
          <button onClick={handlePrev} disabled={isTransitioning}>
            &lt;
          </button>
          <div>
            {displayIndex}/{itemLength}
          </div>
          <button onClick={handleNext} disabled={isTransitioning}>
            &gt;
          </button>
        </>
      )}
    </div>
  );
};

export default CarouselInfiniteNavigator;
