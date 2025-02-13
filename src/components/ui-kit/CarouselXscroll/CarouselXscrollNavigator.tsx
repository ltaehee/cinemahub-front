import { ReactNode, useContext } from "react";
import { CarouselXscrollContext } from ".";

interface CarouselXscrollNavigatorProps {
  children?: (prev: () => void, next: () => void) => ReactNode;
}

const CarouselXscrollNavigator = (props: CarouselXscrollNavigatorProps) => {
  const { children } = props;
  const { itemListRef, scrollPosition, itemWidth } = useContext(
    CarouselXscrollContext
  );

  const handleLeft = () => {
    if (itemListRef.current) {
      itemListRef.current.scrollTo({
        left: itemListRef.current.scrollLeft - itemWidth,
        behavior: "smooth",
      });
    }
  };

  const handleRight = () => {
    if (itemListRef.current) {
      itemListRef.current.scrollTo({
        left: itemListRef.current.scrollLeft + itemWidth,
        behavior: "smooth",
      });
    }
  };

  const isAtEnd = () => {
    if (!itemListRef.current) return false;
    const scrollEnd =
      itemListRef.current.scrollWidth - itemListRef.current.clientWidth;
    return Math.floor(scrollPosition) === scrollEnd;
  };

  const isAtStart = () => {
    return scrollPosition === 0;
  };

  return (
    <>
      {children && typeof children === "function" ? (
        children(handleLeft, handleRight)
      ) : (
        <>
          <button
            style={
              isAtStart()
                ? { display: "none" }
                : {
                    position: "absolute",
                    left: "2rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }
            }
            onClick={handleLeft}
          >
            &lt;
          </button>
          <button
            style={
              isAtEnd()
                ? { display: "none" }
                : {
                    position: "absolute",
                    right: "2rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }
            }
            onClick={handleRight}
          >
            &gt;
          </button>
        </>
      )}
    </>
  );
};

export default CarouselXscrollNavigator;
