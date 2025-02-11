import { accordionItemCls } from "@consts/className";
import { createContext, ReactNode, useMemo } from "react";

interface AccordionItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface AccordionItemContextProps {
  value: string;
}

export const AccordionItemContext = createContext<AccordionItemContextProps>({
  value: "",
});

const AccordionItem = (props: AccordionItemProps) => {
  const { value, children, className } = props;

  const contextValue = {
    value,
  };

  const cls = useMemo(
    () => (className ? `${className} ${accordionItemCls}` : accordionItemCls),
    [className]
  );

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div className={cls}>{children}</div>
    </AccordionItemContext.Provider>
  );
};

export default AccordionItem;
