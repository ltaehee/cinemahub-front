import { FC, useContext, useMemo } from "react";
import { CarouselContext } from ".";
import { carouselItemCls } from "@consts/className";

interface CarouselItemProps {
  index: number;
  className?: string;
}

const CarouselItem: FC<CarouselItemProps> = (props) => {
  const { carouselIndex } = useContext(CarouselContext);
  const { className, index } = props;

  const cls = useMemo(
    () => (className ? `${className} ${carouselItemCls}` : carouselItemCls),
    [className]
  );

  return carouselIndex === index ? (
    <div className={cls}>{carouselIndex}</div>
  ) : null;
};

export default CarouselItem;
