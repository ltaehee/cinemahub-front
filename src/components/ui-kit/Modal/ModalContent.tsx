import { useContext, ReactNode, useMemo, useRef, useEffect } from "react";
import { ModalContext } from ".";
import { createPortal } from "react-dom";
import { modalContentCls } from "@consts/className";

interface ModalContentProps {
  className?: string;
  children: ReactNode;
  fixed?: boolean;
}

const ModalContent = (props: ModalContentProps) => {
  const { open, onCloseModal, portalref } = useContext(ModalContext);
  const { className, children, fixed } = props;

  const contentRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onCloseModal();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("click", handleClickOutside, { capture: true });
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const cls = useMemo(
    () => (className ? `${className} ${modalContentCls}` : modalContentCls),
    [className]
  );

  return (
    <>
      {open &&
        createPortal(
          <div
            style={
              fixed
                ? {
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }
                : {
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }
            }
            ref={contentRef}
            className={cls}
          >
            {children}
          </div>,
          portalref || document.body
        )}
    </>
  );
};

export default ModalContent;
