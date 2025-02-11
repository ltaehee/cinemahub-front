import { useContext, useMemo } from "react";
import { PaginationContext } from ".";
import { paginationNavigatorCls } from "@consts/className";

interface PaginationNavigatorProps {
  className?: string;
}

const PaginationNavigator = (props: PaginationNavigatorProps) => {
  const { currentPage, setCurrentPage, onPageChange, totalPageLength } =
    useContext(PaginationContext);

  const { className } = props;

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

  const cls = useMemo(
    () =>
      className
        ? `${className} ${paginationNavigatorCls}`
        : paginationNavigatorCls,
    [className]
  );

  return (
    <div className={cls}>
      <button disabled={currentPage === 0} onClick={handleClickPrev}>
        prev
      </button>
      <button
        disabled={currentPage + 1 === totalPageLength}
        onClick={handleClickNext}
      >
        next
      </button>
    </div>
  );
};
export default PaginationNavigator;
