import { SVGAttributes } from "react";

interface IconProps extends SVGAttributes<SVGSVGElement> {}

const XIcon = (props: IconProps) => {
  const { ...svgsProps } = props;

  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgsProps}
    >
      <circle
        cx="28"
        cy="28"
        r="28"
        transform="matrix(1 0 0 -1 0 56)"
        fill="black"
        fillOpacity="0.5"
      />
      <path
        d="M41.0003 16.9221L39.2977 15.2196L28.11 26.4073L16.9223 15.2196L15.2197 16.9221L26.4075 28.1098L15.2197 39.2976L16.9223 41L28.11 29.8124L39.2977 41L41.0003 39.2976L29.8126 28.1098L41.0003 16.9221Z"
        fill="white"
      />
    </svg>
  );
};

export default XIcon;
