import { HTMLAttributes, FC } from 'react';
import Image from './image';

interface AspectRatioCompress {
  Image: typeof Image;
}

interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

const AspectRatio: FC<AspectRatioProps> & AspectRatioCompress = (props) => {
  const { children, ratio } = props;
  return (
    <div {...props} style={{ aspectRatio: `${ratio}` }}>
      {children}
    </div>
  );
};

AspectRatio.Image = Image;
export default AspectRatio;
