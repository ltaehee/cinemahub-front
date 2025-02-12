const Header = () => {
  const handleLogout = () => {
    window.location.href = '/api/login/logout';
  };

  return (
    <header>
      <button onClick={() => handleLogout()}></button>
    </header>
  );
};
export default Header;
