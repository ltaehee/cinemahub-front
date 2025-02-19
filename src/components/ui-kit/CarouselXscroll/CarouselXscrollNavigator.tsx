import { CSSProperties, ReactNode, useContext } from "react";
import { CarouselXscrollContext } from ".";

interface CarouselXscrollNavigatorProps {
  children?: (
    prev: () => void,
    next: () => void,
    leftStyle: React.CSSProperties,
    rightStyle: React.CSSProperties
  ) => ReactNode;
}

const CarouselXscrollNavigator = (props: CarouselXscrollNavigatorProps) => {
  const { children } = props;
  const { itemListRef, scrollPosition, pixelMove } = useContext(
    CarouselXscrollContext
  );

  const handleLeft = () => {
    if (itemListRef.current) {
      itemListRef.current.scrollTo({
        left: itemListRef.current.scrollLeft - pixelMove,
        behavior: "smooth",
      });
    }
  };

  const handleRight = () => {
    if (itemListRef.current) {
      itemListRef.current.scrollTo({
        left: itemListRef.current.scrollLeft + pixelMove,
        behavior: "smooth",
      });
    }
  };

  const isAtEnd = () => {
    if (!itemListRef.current) return false;
    const scrollEnd =
      itemListRef.current.scrollWidth - itemListRef.current.clientWidth;

    return Math.abs(scrollPosition - scrollEnd) < 1;
  };

  const isAtStart = () => {
    return scrollPosition === 0;
  };

  const leftButtonStyle: CSSProperties = isAtStart()
    ? { display: "none" }
    : {
        position: "absolute",
        left: "2rem",
        top: "50%",
        transform: "translateY(-50%)",
      };

  const rightButtonStyle: CSSProperties = isAtEnd()
    ? { display: "none" }
    : {
        position: "absolute",
        right: "2rem",
        top: "50%",
        transform: "translateY(-50%)",
      };

  return (
    <>
      {children && typeof children === "function" ? (
        children(handleLeft, handleRight, leftButtonStyle, rightButtonStyle)
      ) : (
        <>
          <button style={leftButtonStyle} onClick={handleLeft}>
            &lt;
          </button>
          <button style={rightButtonStyle} onClick={handleRight}>
            &gt;
          </button>
        </>
      )}
    </>
  );
};

export default CarouselXscrollNavigator;
