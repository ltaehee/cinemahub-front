import {
  createContext,
  ReactNode,
  FC,
  useMemo,
  RefObject,
  useState,
} from "react";
import CarouselXscrollItemContainer from "./CarouselXscrollItemContainer";
import CarouselXscrollItems from "./CarouselXscrollItems";
import CarouselXscrollNavigator from "./CarouselXscrollNavigator";
import { carouselXscrollBaseCls } from "@consts/className";

interface CarouselXscrollCompoundProps {
  ItemContainer: typeof CarouselXscrollItemContainer;
  Items: typeof CarouselXscrollItems;
  Navigator: typeof CarouselXscrollNavigator;
}

interface CarouselXscrollContextProps {
  itemListRef: RefObject<HTMLDivElement | null>;
  baseRect: DOMRect;
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
  itemWidth: number;
}

interface CarouselXscrollProps {
  children: ReactNode;
  className?: string;
  itemListRef: RefObject<HTMLDivElement | null>;
  baseRect: DOMRect;
  itemWidth: number;
}

export const CarouselXscrollContext =
  createContext<CarouselXscrollContextProps>({
    itemListRef: { current: null },
    baseRect: new DOMRect(),
    scrollPosition: 0,
    setScrollPosition: () => {},
    itemWidth: 0,
  });

const CarouselXscroll: FC<CarouselXscrollProps> &
  CarouselXscrollCompoundProps = (props) => {
  const { children, className, itemListRef, baseRect, itemWidth } = props;

  const [scrollPosition, setScrollPosition] = useState(0);

  const contextValue = {
    itemListRef,
    baseRect,
    scrollPosition,
    setScrollPosition,
    itemWidth,
  };

  const cls = useMemo(
    () =>
      className
        ? `${className} ${carouselXscrollBaseCls}`
        : carouselXscrollBaseCls,
    [className]
  );

  return (
    <CarouselXscrollContext.Provider value={contextValue}>
      <div style={{ position: "relative" }} className={cls}>
        {children}
      </div>
    </CarouselXscrollContext.Provider>
  );
};

CarouselXscroll.ItemContainer = CarouselXscrollItemContainer;
CarouselXscroll.Items = CarouselXscrollItems;
CarouselXscroll.Navigator = CarouselXscrollNavigator;

export default CarouselXscroll;
