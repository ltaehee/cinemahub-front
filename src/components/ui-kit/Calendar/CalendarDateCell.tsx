import { useContext } from "react";
import { CalendarContext } from ".";

interface CalendarDateCellProps {
  children: number;
  day: Date;
}

const CalendarDateCell = (props: CalendarDateCellProps) => {
  const { children, day } = props;
  const { setDate, onChange } = useContext(CalendarContext);

  const handleClick = (day: Date) => {
    setDate(day);
    onChange(day);
  };

  return <div onClick={() => handleClick(day)}>{children}</div>;
};

export default CalendarDateCell;
