import { RefObject, useEffect, useState } from "react";

const useInfinite = (trigger: Function, deps: number[]) => {
  const [targetRef, setTargetRef] = useState<RefObject<HTMLElement>>();

  const observerCallback: IntersectionObserverCallback = (entries) => {
    if (entries[0].isIntersecting) {
      trigger();
    }
  };

  const observer = new IntersectionObserver(observerCallback);

  useEffect(() => {
    if (!targetRef?.current) return;

    observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [targetRef, deps]);

  return {
    setTargetRef,
  };
};

export default useInfinite;
