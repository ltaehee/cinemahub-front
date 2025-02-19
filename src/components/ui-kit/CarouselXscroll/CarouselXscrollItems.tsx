import { FC, ReactNode, useContext, useMemo } from "react";
import { CarouselXscrollContext } from ".";
import { carouselXscrollItemsCls } from "@consts/className";

interface CarouselXscrollItemsProps {
  children: ReactNode;
  className?: string;
}

const CarouselXscrollItems: FC<CarouselXscrollItemsProps> = (props) => {
  const { className, children } = props;
  const { baseRect } = useContext(CarouselXscrollContext);

  const cls = useMemo(
    () =>
      className
        ? `${className} ${carouselXscrollItemsCls}`
        : carouselXscrollItemsCls,
    [className]
  );

  return (
    <div
      style={{
        marginLeft: `${baseRect.left}px`,
        display: "flex",
        overflowX: "visible",
      }}
      className={cls}
    >
      {children}
    </div>
  );
};

export default CarouselXscrollItems;
