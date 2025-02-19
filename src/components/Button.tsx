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
      className={`w-full bg-red-500 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold px-6 py-2 text-sm rounded-lg  duration-200 cursor-pointer`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
