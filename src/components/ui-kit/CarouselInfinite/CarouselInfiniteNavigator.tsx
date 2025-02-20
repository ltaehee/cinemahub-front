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

    const transitionTimeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(transitionTimeout);
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
