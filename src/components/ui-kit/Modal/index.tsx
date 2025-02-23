import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import ModalBackdrop from "./ModalBackdrop";
import ModalContent from "./ModalContent";
import ModalTrigger from "./ModalTrigger";
import ModalClose from "./ModalClose";
import { modalBaseCls } from "@consts/className";

interface ModalCompoundProps {
  Backdrop: typeof ModalBackdrop;
  Trigger: typeof ModalTrigger;
  Content: typeof ModalContent;
  Close: typeof ModalClose;
}

interface ModalContextProps {
  onCloseModal: () => void;
  onOpenModal: () => void;
  open: boolean;
}

export const ModalContext = createContext<ModalContextProps>({
  onCloseModal: () => {},
  onOpenModal: () => {},
  open: false,
});

interface ModalProps {
  children: ReactNode;
  className?: string;
  onCloseModal: () => void;
  onOpenModal?: () => void;
  open: boolean;
}

const Modal: FC<ModalProps> & ModalCompoundProps = (props) => {
  const { children, className, onCloseModal, onOpenModal, open } = props;
  const [scrollY, setScrollY] = useState(0);

  const contextValue = {
    onCloseModal,
    onOpenModal: onOpenModal || (() => {}),
    open,
  };

  useEffect(() => {
    const rootElement = document.getElementById("root");

    if (rootElement) {
      if (open) {
        setScrollY(window.scrollY);
        rootElement.style.top = `-${scrollY}px`;
        rootElement.style.position = "fixed";
        window.scrollTo(0, 0);
      } else {
        rootElement.style.position = "";
        rootElement.style.top = "";
        window.scrollTo(0, scrollY);
      }
    }
  }, [open]);

  const cls = useMemo(
    () => (className ? `${className} ${modalBaseCls}` : modalBaseCls),
    [className]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      <div className={cls}>{children}</div>
    </ModalContext.Provider>
  );
};

Modal.Backdrop = ModalBackdrop;
Modal.Trigger = ModalTrigger;
Modal.Content = ModalContent;
Modal.Close = ModalClose;

export default Modal;
