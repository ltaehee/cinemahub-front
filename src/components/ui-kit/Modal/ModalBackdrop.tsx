import { useContext, useMemo } from 'react';
import { ModalContext } from '.';
import { createPortal } from 'react-dom';
import { modalBackdropCls } from '@consts/className';

interface ModalBackdropProps {
  className?: string;
}

const ModalBackdrop = (props: ModalBackdropProps) => {
  const { open } = useContext(ModalContext);
  const { className } = props;
  const cls = useMemo(
    () => (className ? `${className} ${modalBackdropCls}` : modalBackdropCls),
    [className]
  );

  return (
    <>
      {open &&
        createPortal(
          <div
            style={{
              width: '100vw',
              height: '100vh',
              position: 'absolute',
              backgroundColor: 'black',
              opacity: '0.8',
            }}
            className={cls}
          ></div>,
          document.body
        )}
    </>
  );
};

export default ModalBackdrop;
