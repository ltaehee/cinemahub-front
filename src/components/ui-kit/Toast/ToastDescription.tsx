import { toastDescriptionCls } from "@consts/className";
import { useMemo } from "react";

interface ToastDescriptionProps {
  className?: string;
  description: string;
}

const ToastDescription = (props: ToastDescriptionProps) => {
  const { description, className } = props;

  const cls = useMemo(
    () =>
      className ? `${className} ${toastDescriptionCls}` : toastDescriptionCls,
    [className]
  );

  return <div className={cls}>{description}</div>;
};
export default ToastDescription;
