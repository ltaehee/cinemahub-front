import { useContext, useMemo } from "react";
import { PaginationContext } from ".";
import { paginationButtonsCls } from "@consts/className";

interface PaginationButtons {
  className?: string;
}

const PaginationButtons = (props: PaginationButtons) => {
  const { pages, currentPage, setCurrentPage, onPageChange } =
    useContext(PaginationContext);

  const { className } = props;

  const handleChangePageIndex = (index: number) => {
    setCurrentPage(index);
    onPageChange(index);
  };

  const cls = useMemo(
    () =>
      className ? `${className} ${paginationButtonsCls}` : paginationButtonsCls,
    [className]
  );

  return (
    <div className={cls}>
      {pages.map((pageIndex) => (
        <button
          key={`paginator-button-key-${pageIndex}`}
          onClick={() => handleChangePageIndex(pageIndex)}
          disabled={currentPage === pageIndex}
        >
          {pageIndex + 1}
        </button>
      ))}
    </div>
  );
};
export default PaginationButtons;
