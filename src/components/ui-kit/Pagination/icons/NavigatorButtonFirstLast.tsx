import { SVGAttributes } from "react";

interface NavigatorButtonProps extends SVGAttributes<SVGSVGElement> {}

const NavigatorButtonFirstLast = (props: NavigatorButtonProps) => {
  const { ...svgsProps } = props;
  return (
    <svg
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgsProps}
    >
      <path
        d="M12 13L7.0017 8.46955C5.6661 7.25905 5.6661 6.74095 7.0017 5.53045L12 1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 13L2.0017 8.46955C0.6661 7.25905 0.6661 6.74095 2.0017 5.53045L7 1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NavigatorButtonFirstLast;
