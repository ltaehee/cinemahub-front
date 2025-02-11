import { ReactNode, useContext, useMemo } from "react";
import { CarouselContext } from ".";
import { carouselIndicatorCls } from "@consts/className";

interface CarouselIndicatorProps {
  className?: string;
  children?: (indexes: number[], to: (index: number) => void) => ReactNode;
}

const CarouselIndicator = (props: CarouselIndicatorProps) => {
  const { itemLength, setCarouselIndex } = useContext(CarouselContext);
  const { className, children } = props;

  const hadleClickIndicator = (index: number) => {
    setCarouselIndex(index);
  };

  const cls = useMemo(
    () =>
      className ? `${className} ${carouselIndicatorCls}` : carouselIndicatorCls,
    [className]
  );
  return (
    <div className={cls}>
      {children && typeof children === "function"
        ? children(
            Array.from({ length: itemLength }, (_, index) => index),
            hadleClickIndicator
          )
        : Array.from({ length: itemLength }).map((_, index) => {
            return (
              <span onClick={() => hadleClickIndicator(index)} key={index}>
                {index + 1}
              </span>
            );
          })}
    </div>
  );
};

export default CarouselIndicator;
