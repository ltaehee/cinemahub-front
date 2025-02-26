import { HTMLAttributes, ReactNode, useContext } from "react";
import { PaginationContext } from ".";
import NavigatorButton from "./icons/NavigatorButton";
import NavigatorButtonFirstLast from "./icons/NavigatorButtonFirstLast";

interface PaginationNavigatorProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const PaginationNavigator = (props: PaginationNavigatorProps) => {
  const {
    currentPage,
    setCurrentPage,
    onPageChange,
    totalPageLength,
    blockSize,
  } = useContext(PaginationContext);

  const { children } = props;

  const handleClickPrev = () => {
    if (currentPage === 0) return;
    const changedPageIndex = currentPage - 1;
    setCurrentPage(changedPageIndex);
    onPageChange(changedPageIndex);
  };

  const handleClickNext = () => {
    const changedPageIndex = currentPage + 1;
    if (totalPageLength <= changedPageIndex) return;
    setCurrentPage(changedPageIndex);
    onPageChange(changedPageIndex);
  };

  const handleClickFirst = () => {
    setCurrentPage(0);
    onPageChange(0);
  };

  const handleClickLast = () => {
    setCurrentPage(totalPageLength - 1);
    onPageChange(totalPageLength - 1);
  };

  const lastBlock = Math.ceil(totalPageLength / blockSize) - 1;
  const currentBlock = Math.floor(currentPage / blockSize);

  return (
    <div {...props}>
      <button disabled={blockSize > currentPage} onClick={handleClickFirst}>
        <NavigatorButtonFirstLast
          height="16px"
          stroke={
            blockSize > currentPage ? "#cbd5e1" : "oklch(0.637 0.237 25.331)"
          }
        />
      </button>
      <button disabled={currentPage === 0} onClick={handleClickPrev}>
        <NavigatorButton
          height="16px"
          stroke={currentPage === 0 ? "#cbd5e1" : "oklch(0.637 0.237 25.331)"}
        />
      </button>
      {children}
      <button
        disabled={currentPage + 1 === totalPageLength}
        onClick={handleClickNext}
      >
        <NavigatorButton
          height="16px"
          transform="rotate(180)"
          stroke={
            currentPage + 1 === totalPageLength
              ? "#cbd5e1"
              : "oklch(0.637 0.237 25.331)"
          }
        />
      </button>
      <button disabled={currentBlock === lastBlock} onClick={handleClickLast}>
        <NavigatorButtonFirstLast
          height="16px"
          transform="rotate(180)"
          stroke={
            currentBlock === lastBlock ? "#cbd5e1" : "oklch(0.637 0.237 25.331)"
          }
        />
      </button>
    </div>
  );
};
export default PaginationNavigator;
