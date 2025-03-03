import { ReactNode, useContext, useEffect, useMemo, useRef } from "react";
import { PopoverContext } from ".";
import { popoverTriggerCls } from "@consts/className";
import ChevronIcon from "./icon/ChevronIcon";

interface PopoverTriggerProps {
  className?: string;
  children?: ReactNode;
}

const PopoverTrigger = (props: PopoverTriggerProps) => {
  const { setTriggerRect, isOpen, setIsOpen } = useContext(PopoverContext);
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
    <div style={{ display: "flex", alignItems: "center" }}>
      <button onClick={handleClick} ref={buttonRef} className={cls}>
        {children ? children : "Open"}
      </button>
      <ChevronIcon
        style={{
          width: "24px",
          transition: "transform 0.3s ease",
          transform: `rotate(${isOpen ? 90 : -90}deg)`,
        }}
      />
    </div>
  );
};
export default PopoverTrigger;
