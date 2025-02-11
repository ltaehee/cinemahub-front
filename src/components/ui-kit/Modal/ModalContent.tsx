import { useContext, ReactNode, useMemo, useRef, useEffect } from "react";
import { ModalContext } from ".";
import { createPortal } from "react-dom";
import { modalContentCls } from "@consts/className";

interface ModalContentProps {
  className?: string;
  children: ReactNode;
}

const ModalContent = (props: ModalContentProps) => {
  const { open, onCloseModal } = useContext(ModalContext);
  const { className, children } = props;

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
            style={{ position: "absolute" }}
            ref={contentRef}
            className={cls}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
};

export default ModalContent;

// 컨텐츠내부에 클로즈가 렌더링
// 칠드런안에 클로즈를 빼오고
// 클로즈와 클로즈가 아닌것들 분류
