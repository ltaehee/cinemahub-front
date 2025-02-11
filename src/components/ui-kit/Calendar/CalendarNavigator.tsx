import { useContext, useMemo } from "react";
import { CalendarContext } from ".";
import { calendarNavigatorCls } from "@consts/className";

interface CalendarNavigatorProps {
  className?: string;
}

const CalendarNavigator = (props: CalendarNavigatorProps) => {
  const { date, setDate, onChange } = useContext(CalendarContext);
  const { className } = props;

  const handlePrev = () => {
    const currentDate = new Date(date);
    currentDate.setMonth(currentDate.getMonth() - 1);
    setDate(currentDate);
    onChange(currentDate);
  };

  const handleNext = () => {
    const currentDate = new Date(date);
    currentDate.setMonth(currentDate.getMonth() + 1);
    setDate(currentDate);
    onChange(currentDate);
  };

  const cls = useMemo(
    () =>
      className ? `${className} ${calendarNavigatorCls}` : calendarNavigatorCls,
    [className]
  );

  return (
    <div className={cls}>
      <button onClick={handlePrev}>&lt;</button>
      <button onClick={handleNext}>&gt;</button>
    </div>
  );
};

export default CalendarNavigator;
