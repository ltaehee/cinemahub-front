import { HTMLAttributes, useContext } from "react";
import { PaginationContext } from ".";

interface PaginationButtonsProps extends HTMLAttributes<HTMLDivElement> {}

const PaginationButtons = (props: PaginationButtonsProps) => {
  const { pages, currentPage, setCurrentPage, onPageChange } =
    useContext(PaginationContext);

  const handleChangePageIndex = (index: number) => {
    setCurrentPage(index);
    onPageChange(index);
  };

  return (
    <div {...props}>
      {pages.map((pageIndex) => (
        <button
          key={`paginator-button-key-${pageIndex}`}
          onClick={() => handleChangePageIndex(pageIndex)}
          disabled={currentPage === pageIndex}
          style={{
            color:
              currentPage === pageIndex
                ? "oklch(0.637 0.237 25.331)"
                : "#CBD5E1",
          }}
        >
          {pageIndex + 1}
        </button>
      ))}
    </div>
  );
};
export default PaginationButtons;
