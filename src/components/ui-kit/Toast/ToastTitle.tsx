import { toastTitleCls } from "@consts/className";
import { useMemo } from "react";

interface ToastTitleProps {
  className?: string;
  title: string;
}

const ToastTitle = (props: ToastTitleProps) => {
  const { title, className } = props;

  const cls = useMemo(
    () => (className ? `${className} ${toastTitleCls}` : toastTitleCls),
    [className]
  );

  return <div className={cls}>{title}</div>;
};
export default ToastTitle;
