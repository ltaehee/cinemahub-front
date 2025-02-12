import HeaderIcon from '../icons/HeaderIcon';

const Header = () => {
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
            <div>로그인</div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
