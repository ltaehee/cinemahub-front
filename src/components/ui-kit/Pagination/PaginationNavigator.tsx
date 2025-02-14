import { HTMLAttributes, ReactNode, useContext } from "react";
import { PaginationContext } from ".";
import NavigatorButton from "./icons/NavigatorButton";

interface PaginationNavigatorProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const PaginationNavigator = (props: PaginationNavigatorProps) => {
  const { currentPage, setCurrentPage, onPageChange, totalPageLength } =
    useContext(PaginationContext);

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

  return (
    <div {...props}>
      <button disabled={currentPage === 0} onClick={handleClickPrev}>
        <NavigatorButton
          height="16px"
          stroke={currentPage === 0 ? "#cbd5e1" : "#5B21B6"}
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
          stroke={currentPage + 1 === totalPageLength ? "#cbd5e1" : "#5B21B6"}
        />
      </button>
    </div>
  );
};
export default PaginationNavigator;
