import React, { DetailedHTMLProps, HTMLAttributes } from 'react';

interface ThreeDotLoaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  text: string;
}

export const ThreeDotLoader: React.FC<ThreeDotLoaderProps> = ({
  text,
  ...rest
}) => {
  return (
    <div {...rest}>
      <p className="three-dot-loader text-gray">{text}...</p>
    </div>
  );
};
