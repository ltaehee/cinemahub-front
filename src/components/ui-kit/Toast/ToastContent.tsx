import { toastContentCls } from "@consts/className";
import { ReactNode, useMemo } from "react";

interface ToastContentProps {
  children: ReactNode;
  className?: string;
}

const ToastContent = (props: ToastContentProps) => {
  const { children, className } = props;

  const cls = useMemo(
    () => (className ? `${className} ${toastContentCls}` : toastContentCls),
    [className]
  );

  return <div className={cls}>{children}</div>;
};
export default ToastContent;
