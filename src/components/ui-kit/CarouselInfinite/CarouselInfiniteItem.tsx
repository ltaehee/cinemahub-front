import { FC, ReactNode, useMemo } from "react";

import { carouselInfiniteItemCls } from "@consts/className";

interface CarouselInfiniteItemProps {
  index: number;
  className?: string;
  children?: ReactNode;
}

const CarouselInfiniteItem: FC<CarouselInfiniteItemProps> = (props) => {
  const { className, children } = props;

  const cls = useMemo(
    () =>
      className
        ? `${className} ${carouselInfiniteItemCls}`
        : carouselInfiniteItemCls,
    [className]
  );

  return (
    <div className={cls} style={{ width: "100%", flexShrink: "0" }}>
      {children}
    </div>
  );
};

export default CarouselInfiniteItem;
