import React from 'react';

interface NotificationProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
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
      <p className={`text-gray break-all ${subClassName}`}>{text}</p>
    </div>
  );
};
