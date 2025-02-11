import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
  useMemo,
} from "react";
import TabMenuList from "./TapMenuList";
import TabMenu from "./TabMenu";
import TabPanel from "./TabPannel";
import { tabsBaseCls } from "@consts/className";

interface TabsCompoundProps {
  MenuList: typeof TabMenuList;
  Menu: typeof TabMenu;
  Pannel: typeof TabPanel;
}

interface TabsContextProps {
  tabIndex: number;
  setTabindex: Dispatch<SetStateAction<number>>;
  handleClick: (index: number) => void;
  children: ReactNode;
}

export const TabsContext = createContext<TabsContextProps>({
  tabIndex: 1,
  setTabindex: () => {},
  handleClick: () => {},
  children: undefined,
});

interface TapsProps {
  children: ReactNode;
  className?: string;
  onChangeTab?: (tabindex: number) => void;
}

const Tabs: FC<TapsProps> & TabsCompoundProps = (props) => {
  const { children, className, onChangeTab } = props;
  const [tabIndex, setTabindex] = useState<number>(1);

  const handleClick = (index: number) => {
    setTabindex(index);
    onChangeTab?.(index);
  };

  const contextValue = {
    handleClick,
    tabIndex,
    setTabindex,
    children,
  };

  const cls = useMemo(
    () => (className ? `${className} ${tabsBaseCls}` : tabsBaseCls),
    [className]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cls}>{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.MenuList = TabMenuList;
Tabs.Menu = TabMenu;
Tabs.Pannel = TabPanel;

export default Tabs;
