import { ButtonHTMLAttributes } from "react";

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = ({
  onClick,
  children,
  className = "",
  ...rest
}: BaseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${className} w-[100%] bg-[#E00000] hover:bg-[#9A0000] disabled:bg-[#FF6A6A] text-white font-semibold px-6 py-2 text-sm rounded-lg  duration-200 cursor-pointer `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
