import { SVGAttributes } from 'react';

interface LikeIconProps extends SVGAttributes<SVGSVGElement> {
  recomm: boolean;
}

const LikeIcon = (props: LikeIconProps) => {
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
        d="M5.06449 8.19995L8.31609 1C8.96287 1 9.58316 1.25285 10.0405 1.70294C10.4979 2.15302 10.7548 2.76347 10.7548 3.39998V6.59996H15.3558C15.5915 6.59734 15.8249 6.64517 16.0399 6.74014C16.2549 6.83511 16.4464 6.97495 16.601 7.14997C16.7557 7.325 16.8698 7.53102 16.9355 7.75376C17.0012 7.9765 17.017 8.21064 16.9816 8.43995L15.8598 15.6399C15.801 16.0214 15.6041 16.3692 15.3053 16.6191C15.0066 16.869 14.6261 17.0043 14.234 16.9999H5.06449M5.06449 8.19995V16.9999M5.06449 8.19995H2.6258C2.19461 8.19995 1.78108 8.36852 1.47618 8.66858C1.17129 8.96864 1 9.3756 1 9.79994V15.3999C1 15.8243 1.17129 16.2312 1.47618 16.5313C1.78108 16.8313 2.19461 16.9999 2.6258 16.9999H5.06449"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={recomm ? '#ff0000' : '#ffffff'}
      />
    </svg>
  );
};

export default LikeIcon;
