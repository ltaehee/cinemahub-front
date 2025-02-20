import { SVGAttributes } from "react";

interface IconProps extends SVGAttributes<SVGSVGElement> {
  fill: string;
}

const XIcon = (props: IconProps) => {
  const { fill, ...svgsProps } = props;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgsProps}
    >
      <path
        d="M32 2.11317L29.8866 0L16 13.8866L2.11336 0L0 2.11317L13.8867 15.9999L0 29.8866L2.11336 31.9998L16 18.1132L29.8866 31.9998L32 29.8866L18.1133 15.9999L32 2.11317Z"
        fill={fill}
      />
    </svg>
  );
};

export default XIcon;
