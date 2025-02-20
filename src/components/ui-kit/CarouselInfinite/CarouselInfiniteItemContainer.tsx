import { carouselInfiniteItemContainerCls } from "@consts/className";
import { ReactNode, useContext, useMemo } from "react";
import { CarouselInfiniteContext } from ".";

interface CarouselInfiniteItemContainerProps {
  children: ReactNode;
  className?: string;
}

const CarouselInfiniteItemContainer = (
  props: CarouselInfiniteItemContainerProps
) => {
  const { children, className } = props;
  const { carouselIndex, transition } = useContext(CarouselInfiniteContext);

  const cls = useMemo(
    () =>
      className
        ? `${className} ${carouselInfiniteItemContainerCls}`
        : carouselInfiniteItemContainerCls,
    [className]
  );

  return (
    <div
      className={cls}
      style={{
        transition: `${transition ? "transform 0.5s ease-in-out" : "none"}`,
        transform: `translateX(-${carouselIndex * 100}%)`,
      }}
    >
      {children}
    </div>
  );
};

export default CarouselInfiniteItemContainer;
