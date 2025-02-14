import { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useLoginStore from '../store/useStore';

const PublicRoute = ({ element }: { element: ReactElement }) => {
  const navigator = useNavigate();
  const IsLogin = useLoginStore((state) => state.IsLogin);

  useEffect(() => {
    if (IsLogin) {
      navigator('/', { replace: true });
    }
  }, [IsLogin]);

  return element;
};

export default PublicRoute;
