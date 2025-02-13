import { useNavigate } from 'react-router';
import { getFetchUserLogout } from '../apis/login';
import HeaderIcon from '../icons/HeaderIcon';
import useLoginStore from '../store/useStore';

const Header = () => {
  const { IsLogin, logout } = useLoginStore();
  const navigator = useNavigate();

  const handleLogoutFetch = async () => {
    try {
      const { result } = await getFetchUserLogout();
      if (result) {
        logout();
        navigator('/login', { replace: true });
      }
    } catch (e) {}
  };

  return (
    <header className="sticky top-0">
      <div className="flex justify-center items-center border-b border-slate-300">
        <div className="flex justify-between items-center gap-8 px-8 py-2 h-16 w-1280">
          <div className="flex items-center gap-8">
            <button>
              <HeaderIcon className="w-full" />
            </button>
            <button>박스오피스</button>
          </div>

          <div>
            <div>
              <button className=""></button>
            </div>
            {IsLogin ? (
              <button onClick={handleLogoutFetch}>로그아웃</button>
            ) : (
              <div onClick={() => navigator('/login')}>로그인</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
