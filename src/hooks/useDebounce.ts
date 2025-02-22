import { useEffect, useState } from 'react';

const UseDebounce = <T>(value: T, delay: number) => {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [value, delay]);

  return debounceValue;
};

export default UseDebounce;
