import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
  FC,
  useMemo,
} from "react";
import CarouselItemList from "./CarouselItemList";
import CarouselItem from "./CarouselItem";
import CarouselNavigator from "./CarouselNavigator";
import CarouselIndicator from "./CarouselIndicator";
import { carouselBaseCls } from "@consts/className";

interface CarouselCompoundProps {
  ItemList: typeof CarouselItemList;
  Item: typeof CarouselItem;
  Navigator: typeof CarouselNavigator;
  Indicator: typeof CarouselIndicator;
}

interface CarouselContextProps {
  itemLength: number;
  carouselIndex: number;
  setCarouselIndex: Dispatch<SetStateAction<number>>;
}

interface CarouselProps {
  itemLength: number;
  children: ReactNode;
  className?: string;
}

export const CarouselContext = createContext<CarouselContextProps>({
  itemLength: 0,
  carouselIndex: 0,
  setCarouselIndex: () => {},
});

const Carousel: FC<CarouselProps> & CarouselCompoundProps = (props) => {
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const { itemLength, children, className } = props;

  const contextValue = {
    itemLength,
    carouselIndex,
    setCarouselIndex,
  };

  const cls = useMemo(
    () => (className ? `${className} ${carouselBaseCls}` : carouselBaseCls),
    [className]
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      <div className={cls}>{children}</div>
    </CarouselContext.Provider>
  );
};

Carousel.ItemList = CarouselItemList;
Carousel.Item = CarouselItem;
Carousel.Navigator = CarouselNavigator;
Carousel.Indicator = CarouselIndicator;

export default Carousel;
