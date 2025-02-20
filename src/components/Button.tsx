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
      className={`${className} w-[100%] bg-[oklch(.637_.237_25.331)] hover:bg-[oklch(.505_.213_27.518)] disabled:bg-[oklch(.885_.062_18.334)] text-[#fff] font-semibold px-6 py-2 text-[1rem] rounded-lg  duration-200 cursor-pointer `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
