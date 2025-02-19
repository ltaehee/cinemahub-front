import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
  FC,
  useMemo,
} from "react";
import CarouselItemContainer from "./CarouselInfiniteItemContainer";
import CarouselItemList from "./CarouselInfiniteItemList";
import CarouselItem from "./CarouselInfiniteItem";
import CarouselNavigator from "./CarouselInfiniteNavigator";
import { carouselInfiniteBaseCls } from "@consts/className";

interface CarouselInfiniteCompoundProps {
  ItemContainer: typeof CarouselItemContainer;
  ItemList: typeof CarouselItemList;
  Item: typeof CarouselItem;
  Navigator: typeof CarouselNavigator;
}

interface CarouselInfiniteContextProps {
  itemLength: number;
  setItemLength: Dispatch<SetStateAction<number>>;
  carouselIndex: number;
  setCarouselIndex: Dispatch<SetStateAction<number>>;
  transition: boolean;
  setTransition: Dispatch<SetStateAction<boolean>>;
  displayIndex: number;
}

interface CarouselInfiniteProps {
  children: ReactNode;
  className?: string;
}

export const CarouselInfiniteContext =
  createContext<CarouselInfiniteContextProps>({
    itemLength: 0,
    setItemLength: () => {},
    carouselIndex: 1,
    setCarouselIndex: () => {},
    transition: true,
    setTransition: () => {},
    displayIndex: 1,
  });

const CarouselInfinite: FC<CarouselInfiniteProps> &
  CarouselInfiniteCompoundProps = (props) => {
  const [carouselIndex, setCarouselIndex] = useState<number>(1);
  const [itemLength, setItemLength] = useState<number>(0);
  const { children, className } = props;
  const [transition, setTransition] = useState(true);

  const displayIndex = useMemo(() => {
    if (carouselIndex === 0) {
      return itemLength;
    } else if (carouselIndex > itemLength) {
      return 1;
    } else {
      return carouselIndex;
    }
  }, [carouselIndex, itemLength]);

  const contextValue = {
    itemLength,
    transition,
    setTransition,
    setItemLength,
    carouselIndex,
    setCarouselIndex,
    displayIndex,
  };

  const cls = useMemo(
    () =>
      className
        ? `${className} ${carouselInfiniteBaseCls}`
        : carouselInfiniteBaseCls,
    [className]
  );

  return (
    <CarouselInfiniteContext.Provider value={contextValue}>
      <div className={cls} style={{ overflow: "hidden" }}>
        {children}
      </div>
    </CarouselInfiniteContext.Provider>
  );
};

CarouselInfinite.ItemContainer = CarouselItemContainer;
CarouselInfinite.ItemList = CarouselItemList;
CarouselInfinite.Item = CarouselItem;
CarouselInfinite.Navigator = CarouselNavigator;

export default CarouselInfinite;
