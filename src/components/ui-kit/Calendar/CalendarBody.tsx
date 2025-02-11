import { useMemo } from "react";
import { calendarBodyCls } from "@consts/className";
import CalendarDateCell from "./CalendarDateCell";
import useCalendarDate from "./hooks/useCalendarDate";

interface CalendarBodyProps {
  className?: string;
}

const CalendarBody = (props: CalendarBodyProps) => {
  const { className } = props;
  const { weeks } = useCalendarDate();

  const cls = useMemo(
    () => (className ? `${className} ${calendarBodyCls}` : calendarBodyCls),
    [className]
  );

  return (
    <div className={cls}>
      {weeks.map((week, index) => (
        <div key={index}>
          {week.map((day, index) => (
            <CalendarDateCell day={day} key={index}>
              {day.getDate()}
            </CalendarDateCell>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CalendarBody;
