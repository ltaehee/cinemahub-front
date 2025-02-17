import { ReactElement, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useLoginStore from '../store/useStore';

const PrivateRouter = ({ element }: { element: ReactElement }) => {
  const { pathname } = useLocation();
  const navigator = useNavigate();
  const IsLogin = useLoginStore((set) => set.IsLogin);

  useEffect(() => {
    if (IsLogin && (pathname === '/login' || pathname === '/register')) {
      navigator('/', { replace: true });
    }
  }, [IsLogin, location.pathname]);

  return element;
};

export default PrivateRouter;
