import { SVGAttributes } from "react";

interface CameraIconProps extends SVGAttributes<SVGSVGElement> {
  height?: string;
  className?: string;
}

const CameraIcon = (props: CameraIconProps) => {
  const { height, className, ...rest } = props;

  return (
    <svg
      className={className}
      height={height}
      viewBox="0 0 80 80"
      fill="#9D9D9D"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path d="M39.9816 50.74C44.4969 50.74 48.1573 47.0797 48.1573 42.5644C48.1573 38.049 44.4969 34.3887 39.9816 34.3887C35.4663 34.3887 31.8059 38.049 31.8059 42.5644C31.8059 47.0797 35.4663 50.74 39.9816 50.74Z" />
      <path d="M32.3656 17.1768L27.7196 22.2447H19.6718C16.8791 22.2447 14.5942 24.5253 14.5942 27.3127V57.7205C14.5942 60.5079 16.8791 62.7885 19.6718 62.7885H60.292C63.0846 62.7885 65.3695 60.5079 65.3695 57.7205V27.3127C65.3695 24.5253 63.0846 22.2447 60.292 22.2447H52.2441L47.5982 17.1768H32.3656ZM39.9819 55.1865C32.9749 55.1865 27.2881 49.5104 27.2881 42.5166C27.2881 35.5228 32.9749 29.8467 39.9819 29.8467C46.9889 29.8467 52.6757 35.5228 52.6757 42.5166C52.6757 49.5104 46.9889 55.1865 39.9819 55.1865Z" />
    </svg>
  );
};

export default CameraIcon;
