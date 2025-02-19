import { FC, ReactNode, useContext, useMemo, useState } from "react";

import { carouselInfiniteItemCls } from "@consts/className";
import { CarouselInfiniteContext } from ".";

interface CarouselInfiniteItemProps {
  index: number;
  className?: string;
  children: (carouselIndex: number) => ReactNode;
}

const CarouselInfiniteItem: FC<CarouselInfiniteItemProps> = (props) => {
  const { className, children } = props;
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const { handlePrev, handleNext, carouselIndex } = useContext(
    CarouselInfiniteContext
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const distance = touchStartX - touchEndX;
      if (Math.abs(distance) > 50) {
        if (distance > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
      setTouchStartX(null);
    }
  };

  const cls = useMemo(
    () =>
      className
        ? `${className} ${carouselInfiniteItemCls}`
        : carouselInfiniteItemCls,
    [className]
  );

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={cls}
      style={{ width: "100%", flexShrink: "0" }}
    >
      {children(carouselIndex)}
    </div>
  );
};

export default CarouselInfiniteItem;
