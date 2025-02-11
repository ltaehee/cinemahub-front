import CalendarCurrent from "./CalendarCurrent";
import CalendarNavigator from "./CalendarNavigator";
import CalendarBody from "./CalendarBody";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { calendarBaseCls } from "@consts/className";

interface CalendarCompoundProps {
  Current: typeof CalendarCurrent;
  Navigator: typeof CalendarNavigator;
  Body: typeof CalendarBody;
}

interface CalendarContextProps {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  onChange: (date: Date) => void;
}

export const CalendarContext = createContext<CalendarContextProps>({
  date: new Date(),
  setDate: () => {},
  onChange: () => {},
});

interface CalendarProps {
  children: ReactNode;
  className?: string;
  onChange: (date: Date) => void;
  value: Date;
}

const Calendar: FC<CalendarProps> & CalendarCompoundProps = (props) => {
  const { children, className, onChange, value } = props;
  const [date, setDate] = useState<Date>(value);

  const contextValue = { date, setDate, onChange };

  const cls = useMemo(
    () => (className ? `${className} ${calendarBaseCls}` : calendarBaseCls),
    [className]
  );

  return (
    <CalendarContext.Provider value={contextValue}>
      <div className={cls}>{children}</div>
    </CalendarContext.Provider>
  );
};

Calendar.Current = CalendarCurrent;
Calendar.Navigator = CalendarNavigator;
Calendar.Body = CalendarBody;

export default Calendar;
