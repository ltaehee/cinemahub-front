import { ReactNode, useContext, useMemo } from "react";
import { CarouselXscrollContext } from ".";
import { carouselXscrollItemContainerCls } from "@consts/className";

interface CarouselXscrollItemContainerProps {
  children: ReactNode;
  className?: string;
}

const CarouselXscrollItemContainer = (
  props: CarouselXscrollItemContainerProps
) => {
  const { children, className } = props;
  const { itemListRef, setScrollPosition } = useContext(CarouselXscrollContext);

  const handleScroll = () => {
    if (itemListRef.current) {
      setScrollPosition(itemListRef.current.scrollLeft);
    }
  };

  const cls = useMemo(
    () =>
      className
        ? `${className} ${carouselXscrollItemContainerCls}`
        : carouselXscrollItemContainerCls,
    [className]
  );

  return (
    <div
      onScroll={handleScroll}
      style={{
        position: "relative",
        overflow: "scroll",
        display: "flex",
        alignItems: "center",
        scrollbarWidth: "none",
      }}
      ref={itemListRef}
      className={cls}
    >
      {children}
    </div>
  );
};

export default CarouselXscrollItemContainer;
