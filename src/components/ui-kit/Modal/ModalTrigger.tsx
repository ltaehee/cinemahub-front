import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import { ModalContext } from ".";
import { modalTriggerCls } from "@consts/className";

interface ModalTriggerProps {
  className?: string;
  children?: ReactNode;
}

const ModalTrigger = (props: ModalTriggerProps) => {
  const { onOpenModal } = useContext(ModalContext);
  const { className, children } = props;

  const cls = useMemo(
    () => (className ? `${className} ${modalTriggerCls}` : modalTriggerCls),
    [className]
  );
  return (
    <>
      {children ? (
        isValidElement(children) ? (
          cloneElement(children as ReactElement, {
            onClick: onOpenModal,
          })
        ) : (
          Children.map(children, (child) =>
            cloneElement(child as ReactElement, {
              onClick: onOpenModal,
            })
          )
        )
      ) : (
        <button onClick={onOpenModal} className={cls}>
          open
        </button>
      )}
    </>
  );
};

export default ModalTrigger;
