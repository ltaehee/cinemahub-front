import { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useLoginStore from '../store/useStore';

const PrivateRoute = ({ element }: { element: ReactElement }) => {
  const navigator = useNavigate();
  const IsLogin = useLoginStore((state) => state.IsLogin);

  useEffect(() => {
    if (!IsLogin) {
      navigator('/login', { replace: true });
    } else {
      navigator('/', { replace: true });
    }
  }, [IsLogin]);

  return element;
};

export default PrivateRoute;
