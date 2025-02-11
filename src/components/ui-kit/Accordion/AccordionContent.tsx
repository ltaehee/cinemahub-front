import { accordionContentCls } from "@consts/className";
import { ReactNode, useContext, useMemo } from "react";
import { AccordionContext } from ".";
import { AccordionItemContext } from "./AccordionItem";

interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

const AccordionContent = (props: AccordionContentProps) => {
  const { children, className } = props;
  const { openItem } = useContext(AccordionContext);
  const { value } = useContext(AccordionItemContext);

  const cls = useMemo(
    () =>
      className ? `${className} ${accordionContentCls}` : accordionContentCls,
    [className]
  );

  return (
    <>
      {openItem.includes(value) ? <div className={cls}>{children}</div> : null}
    </>
  );
};

export default AccordionContent;
