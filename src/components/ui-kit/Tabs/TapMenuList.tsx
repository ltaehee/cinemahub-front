import { tabsMenuListBaseCls } from "@consts/className";
import { ReactNode, useMemo } from "react";

interface TabMenuListProps {
  children: ReactNode;
  className?: string;
}

const TabMenuList = (props: TabMenuListProps) => {
  const { children, className } = props;

  const cls = useMemo(
    () =>
      className ? `${className} ${tabsMenuListBaseCls}` : tabsMenuListBaseCls,
    [className]
  );

  return <div className={cls}>{children}</div>;
};

export default TabMenuList;
