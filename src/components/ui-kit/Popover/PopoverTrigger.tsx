import { ReactNode, useContext, useEffect, useMemo, useRef } from "react";
import { PopoverContext } from ".";
import { popoverTriggerCls } from "@consts/className";

interface PopoverTriggerProps {
  className?: string;
  children?: ReactNode;
}

const PopoverTrigger = (props: PopoverTriggerProps) => {
  const { setTriggerRect, setIsOpen } = useContext(PopoverContext);
  const { className, children } = props;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const calculateTriggerRect = () => {
    if (!buttonRef.current) return;
    setTriggerRect(buttonRef.current.getBoundingClientRect());
  };

  useEffect(() => {
    calculateTriggerRect();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", calculateTriggerRect);

    return () => {
      window.removeEventListener("resize", calculateTriggerRect);
    };
  }, []);

  const cls = useMemo(
    () => (className ? `${className} ${popoverTriggerCls}` : popoverTriggerCls),
    [className]
  );

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <button onClick={handleClick} ref={buttonRef} className={cls}>
      {children ? children : "Open"}
    </button>
  );
};
export default PopoverTrigger;
