import { FC, useMemo } from "react";
import Popover from "@ui/Popover";
import Calendar from "@ui/Calendar";
import { datePickerBaseCls } from "@consts/className";

interface DatePickerProps {
  className?: string;
  date: Date;
  onChangeDate: (date: Date) => void;
}

const DatePicker: FC<DatePickerProps> = (props) => {
  const { className, date, onChangeDate } = props;

  const cls = useMemo(
    () => (className ? `${className} ${datePickerBaseCls}` : datePickerBaseCls),
    [className]
  );

  return (
    <Popover className={cls} position="bottom-left">
      <Calendar onChange={onChangeDate} value={date}>
        <Popover.Trigger>
          <Calendar.Current />
        </Popover.Trigger>
        <Popover.Content>
          <Calendar.Navigator />
          <Calendar.Body />
        </Popover.Content>
      </Calendar>
    </Popover>
  );
};
export default DatePicker;
