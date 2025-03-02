import { useRef } from 'react';

const useLikeDebounce = () => {
  const timer = useRef<NodeJS.Timeout | number>(0);

  return <T extends (...args: any[]) => void>(callback: T, delay: number) => {
    return (...args: Parameters<T>) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => callback(...args), delay);
    };
  };
};

export default useLikeDebounce;
