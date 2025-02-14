import {
  createContext,
  Dispatch,
  FC,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import PaginationButtons from "./PaginationButtons";
import PaginationNavigator from "./PaginationNavigator";

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

interface PagenationProps extends HTMLAttributes<HTMLDivElement> {
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
    total,
    value = 0,
    onPageChange,
    blockSize = 10,
    pageSize = 20,
    className,
  } = props;
  const [currentPage, setCurrentPage] = useState(value);

  const totalPageLength = useMemo(
    () => Math.floor(Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  const firstPageFromCurrent = useMemo(
    () => Math.floor(currentPage / blockSize) * 10,
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

  return (
    <PaginationContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </PaginationContext.Provider>
  );
};

Pagination.Buttons = PaginationButtons;
Pagination.Navigator = PaginationNavigator;

export default Pagination;
