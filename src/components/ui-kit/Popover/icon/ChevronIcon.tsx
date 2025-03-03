import { SVGAttributes } from "react";

interface ChevronIconProps extends SVGAttributes<SVGSVGElement> {
  stroke?: string;
  thickness?: string;
}

const ChevronIcon = (props: ChevronIconProps) => {
  const { color, thickness, ...svgsProps } = props;
  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgsProps}
    >
      <path
        d="M32 38L23.6695 30.4492C21.4435 28.4317 21.4435 27.5682 23.6695 25.5507L32 18"
        stroke={color ? color : "#000"}
        strokeWidth={thickness ? thickness : "2"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChevronIcon;
