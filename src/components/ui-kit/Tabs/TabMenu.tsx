import { ReactNode, useContext, useMemo } from "react";
import { TabsContext } from ".";
import { tabsMenuBaseCls } from "@consts/className";

interface TabMenuProps {
  index: number;
  children: ReactNode;
  className?: string;
}

const TabMenu = (props: TabMenuProps) => {
  const { handleClick, tabIndex } = useContext(TabsContext);
  const { index, children, className } = props;

  const isActive = useMemo(() => tabIndex === index, [tabIndex, index]);

  const cls = useMemo(
    () => (className ? `${className} ${tabsMenuBaseCls}` : tabsMenuBaseCls),
    [className]
  );

  return (
    <div
      className={cls}
      data-active={isActive}
      onClick={() => handleClick(index)}
    >
      <button>{children}</button>
    </div>
  );
};

export default TabMenu;
