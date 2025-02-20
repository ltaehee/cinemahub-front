import {
  Children,
  FC,
  isValidElement,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { CarouselInfiniteContext } from ".";
import { carouselInfiniteItemListCls } from "@consts/className";

interface CarouselInfiniteItemListProps {
  className?: string;
  children?: ReactNode;
}

const CarouselInfiniteItemList: FC<CarouselInfiniteItemListProps> = (props) => {
  const { setItemLength } = useContext(CarouselInfiniteContext);
  const { className, children } = props;

  useEffect(() => {
    const totalItems = Children.count(children);
    setItemLength(totalItems);
  }, [children, setItemLength]);

  const extendedItems = useMemo(() => {
    const items = Children.toArray(children);
    return [
      {
        ...(items[items.length - 1] as ReactElement<any>),
        key: `transition last`,
      },
      ...items.map((item, index) => {
        if (isValidElement(item)) {
          return { ...item, key: `${index}` };
        }
        return item;
      }),
      { ...(items[0] as ReactElement<any>), key: `transition first` },
    ];
  }, [children]);

  const cls = useMemo(
    () =>
      className
        ? `${className} ${carouselInfiniteItemListCls}`
        : carouselInfiniteItemListCls,
    [className]
  );

  return (
    <div className={cls} style={{ width: "100%", display: "flex" }}>
      {extendedItems}
    </div>
  );
};

export default CarouselInfiniteItemList;
