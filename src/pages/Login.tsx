import GoogleIcon from '../icons/GoogleIcon';
import bgMovies from '../images/bg-image.jpg';

const Login = () => {
  const handleGoogleSignin = () => {
    window.location.href = '/api/login/google/google-oauth';
  };

  return (
    <>
      <div className="relative grid place-items-center w-full h-screen">
        <div className="absolute z-0 inset-0 overflow-hidden">
          <img
            className="min-w-full min-h-full max-w-none"
            src={bgMovies}
            alt="배경 이미지"
          />
        </div>

        <div className="relative z-1 max-w-2xl px-2 mx-auto opacity-80">
          <div className="flex flex-col items-center justify-center p-10 rounded-2xl bg-slate-200 gap-5">
            <h1 className="font-bold text-2xl">로그인</h1>
            <div className="w-60">
              <GoogleIcon
                className="cursor-pointer"
                onClick={handleGoogleSignin}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
