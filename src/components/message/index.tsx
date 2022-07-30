import React from 'react';
import useStore, { Chat } from '@/store';

interface MessageProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  chat: Chat;
}

const Message: React.FC<MessageProps> = ({ chat, ...rest }) => {
  const uid = useStore((state) => state.uid);

  return (
    <div {...rest}>
      <p className="break-all">
        <span className="font-bold">
          {chat.uid === uid
            ? chat.timestamp
              ? 'you : '
              : '[me@cherm] → '
            : 'stranger : '}
        </span>
        {chat.message}
      </p>
    </div>
  );
};

export default Message;
