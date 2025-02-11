import { carouselItemListCls } from "@consts/className";
import { ReactNode, useMemo } from "react";

interface CarouselItemListProps {
  children: ReactNode;
  className?: string;
}

const CarouselItemList = (props: CarouselItemListProps) => {
  const { children, className } = props;

  const cls = useMemo(
    () =>
      className ? `${className} ${carouselItemListCls}` : carouselItemListCls,
    [className]
  );

  return <div className={cls}>{children}</div>;
};

export default CarouselItemList;
