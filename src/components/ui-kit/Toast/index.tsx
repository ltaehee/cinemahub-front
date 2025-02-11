import { toastBaseCls } from "@consts/className";
import { CSSProperties, useEffect, useMemo, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import ToastContent from "./ToastContent";
import ToastTitle from "./ToastTitle";
import ToastDescription from "./ToastDescription";

interface ToastProps {
  title: string;
  description: string;
  duration?: number;
}

type ToasterPositions =
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "top-left"
  | "top-center"
  | "top-right";

interface ToasterProps {
  className?: string;
  position?: ToasterPositions;
}

export const useToast = () => {
  const timeoutRef = useRef<number | null>(null);
  const rootRef = useRef<Root | null>(null);

  const toast = ({ title, description, duration = 2000 }: ToastProps) => {
    const domNode = document.getElementById("ui-toaster");

    if (domNode) {
      if (!rootRef.current) rootRef.current = createRoot(domNode);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      rootRef.current.render(
        <ToastContent>
          <ToastTitle title={title} />
          <ToastDescription description={description} />
        </ToastContent>
      );

      timeoutRef.current = window.setTimeout(() => {
        rootRef.current?.unmount();
        rootRef.current = null;
        timeoutRef.current = null;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }, duration);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { toast };
};

export const Toaster = (props: ToasterProps) => {
  const { className, position = "bottom-right" } = props;

  const mapPositionToStyle: {
    [key in ToasterPositions]: Partial<
      Pick<
        CSSProperties,
        "top" | "bottom" | "left" | "right" | "position" | "transform"
      >
    >;
  } = {
    "bottom-left": { position: "fixed", bottom: "0px", left: "0px" },
    "bottom-center": {
      position: "fixed",
      bottom: "0px",
      left: "50%",
      transform: "translateX(-50%)",
    },
    "bottom-right": { position: "fixed", bottom: "0px", right: "0px" },
    "top-left": { position: "fixed" },
    "top-center": {
      position: "fixed",
      top: "0px",
      left: "50%",
      transform: "translateX(-50%)",
    },
    "top-right": { position: "fixed", top: "0px", right: "0px" },
  };

  const cls = useMemo(
    () => (className ? `${className} ${toastBaseCls}` : toastBaseCls),
    [className]
  );

  return (
    <div
      className={cls}
      style={mapPositionToStyle[position]}
      id={"ui-toaster"}
    />
  );
};
