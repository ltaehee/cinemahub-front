import { SVGAttributes } from 'react';

interface UnlikeIconProps extends SVGAttributes<SVGSVGElement> {
  recomm: boolean;
}

const UnlikeIcon = (props: UnlikeIconProps) => {
  const { recomm = false, ...svgProps } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 18 18"
      fill="none"
      {...svgProps}
    >
      <path
        d="M5.06449 9.80005L8.31609 17C8.96287 17 9.58316 16.7471 10.0405 16.2971C10.4979 15.847 10.7548 15.2365 10.7548 14.6L10.7548 11.4L15.3558 11.4C15.5915 11.4027 15.8249 11.3548 16.0399 11.2599C16.2549 11.1649 16.4464 11.025 16.601 10.85C16.7557 10.675 16.8698 10.469 16.9355 10.2462C17.0012 10.0235 17.017 9.78936 16.9816 9.56005L15.8598 2.36009C15.801 1.97857 15.6041 1.63081 15.3053 1.38089C15.0066 1.13098 14.6261 0.995739 14.234 1.0001L5.06449 1.0001M5.06449 9.80005L5.06449 1.0001M5.06449 9.80005L2.6258 9.80005C2.19461 9.80005 1.78108 9.63148 1.47618 9.33142C1.17129 9.03136 0.999999 8.6244 0.999999 8.20006L0.999999 2.60009C0.999999 2.17575 1.17129 1.76879 1.47618 1.46873C1.78108 1.16867 2.19461 1.0001 2.6258 1.0001L5.06449 1.0001"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={recomm ? '#ff0000' : '#ffffff'}
      />
    </svg>
  );
};

export default UnlikeIcon;
