import React, { DetailedHTMLProps, HTMLAttributes } from 'react';

interface NotificationProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subClassName?: string;
  text: string;
}

export const Notification: React.FC<NotificationProps> = ({
  subClassName,
  text,
  ...rest
}) => {
  return (
    <div {...rest}>
      <p className={`text-gray ${subClassName}`}>{text}</p>
    </div>
  );
};
