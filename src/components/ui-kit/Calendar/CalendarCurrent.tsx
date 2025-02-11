import { useContext, useMemo } from "react";
import { CalendarContext } from ".";
import { calendarCurrentCls } from "@consts/className";

const arrDayStr = ["일", "월", "화", "수", "목", "금", "토"];

interface CalendarCurrentProps {
  className?: string;
}

const CalendarCurrent = (props: CalendarCurrentProps) => {
  const { date } = useContext(CalendarContext);
  const { className } = props;

  const currentDate =
    date.getFullYear() +
    "년 " +
    (date.getMonth() + 1) +
    "월 " +
    date.getDate() +
    "일 (" +
    arrDayStr[date.getDay()] +
    ")";

  const cls = useMemo(
    () =>
      className ? `${className} ${calendarCurrentCls}` : calendarCurrentCls,
    [className]
  );

  return <div className={cls}>{currentDate}</div>;
};

export default CalendarCurrent;
