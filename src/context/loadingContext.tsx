import { createContext, ReactNode, useContext, useState } from 'react';

interface LoadingProviderProps {
  children: ReactNode;
}

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
});

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('LoadingContext 호출 범위 내에서 사용 가능');
  }
  return context;
};

const LoadingProvider = (props: LoadingProviderProps) => {
  const { children } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const loadingContext = {
    isLoading,
    setLoading,
  };

  return (
    <LoadingContext.Provider value={loadingContext}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
