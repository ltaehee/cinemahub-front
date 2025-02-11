import { accordionTriggerCls } from "@consts/className";
import { ReactNode, useContext, useMemo } from "react";
import { AccordionContext } from ".";
import { AccordionItemContext } from "./AccordionItem";

interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
}

const AccordionTrigger = (props: AccordionTriggerProps) => {
  const { children, className } = props;
  const { openItem, setOpenItem } = useContext(AccordionContext);
  const { value } = useContext(AccordionItemContext);

  const cls = useMemo(
    () =>
      className ? `${className} ${accordionTriggerCls}` : accordionTriggerCls,
    [className]
  );

  return (
    <button
      onClick={() =>
        setOpenItem(
          openItem.includes(value)
            ? openItem.filter((item) => item !== value)
            : (prev) => [...prev, value]
        )
      }
      className={cls}
    >
      {children}
    </button>
  );
};

export default AccordionTrigger;
