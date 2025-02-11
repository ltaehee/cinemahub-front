import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import PaginationButtons from "./PaginationButtons";
import PaginationNavigator from "./PaginationNavigator";
import { paginationBaseCls } from "@consts/className";

interface PaginationCompoundProps {
  Buttons: typeof PaginationButtons;
  Navigator: typeof PaginationNavigator;
}

interface PaginationContextProps {
  onPageChange: (value: number) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPageLength: number;
  pages: number[];
}

export const PaginationContext = createContext<PaginationContextProps>({
  onPageChange: () => {},
  currentPage: 0,
  setCurrentPage: () => {},
  totalPageLength: 0,
  pages: [],
});

interface PagenationProps {
  children: ReactNode;
  className?: string;
  total: number;
  value: number;
  onPageChange: (value: number) => void;
  blockSize?: number;
  pageSize?: number;
}

const Pagination: FC<PagenationProps> & PaginationCompoundProps = (props) => {
  const {
    children,
    className,
    total,
    value = 0,
    onPageChange,
    blockSize = 10,
    pageSize = 10,
  } = props;
  const [currentPage, setCurrentPage] = useState(value);

  const totalPageLength = useMemo(
    () => Math.floor(Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  const firstPageFromCurrent = useMemo(
    () => Math.floor(currentPage / blockSize) * blockSize,
    [currentPage, blockSize]
  );

  const lastPageFromCurrent = useMemo(() => {
    const last =
      Math.floor(currentPage / blockSize) * blockSize + blockSize - 1;
    return last < totalPageLength - 1 ? last : totalPageLength - 1;
  }, [currentPage, blockSize, totalPageLength]);

  const blockLengthFromCurrent = useMemo(
    () => lastPageFromCurrent - firstPageFromCurrent + 1,
    [lastPageFromCurrent, firstPageFromCurrent]
  );

  const pages = useMemo(
    () =>
      Array.from(
        { length: blockLengthFromCurrent },
        (_, index) => firstPageFromCurrent + index
      ),
    [blockLengthFromCurrent, firstPageFromCurrent]
  );

  const contextValue = {
    onPageChange,
    currentPage,
    setCurrentPage,
    totalPageLength,
    pages,
  };

  const cls = useMemo(
    () => (className ? `${className} ${paginationBaseCls}` : paginationBaseCls),
    [className]
  );

  return (
    <PaginationContext.Provider value={contextValue}>
      <div className={cls}>{children}</div>
    </PaginationContext.Provider>
  );
};

Pagination.Buttons = PaginationButtons;
Pagination.Navigator = PaginationNavigator;

export default Pagination;
