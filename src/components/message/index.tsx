import React from 'react';
import { ps1 } from '@/utils/constants';
import { isValidCommand } from '@/utils/helpers';
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
            ? isValidCommand(chat.message) || !chat.timestamp
              ? ps1 
              : 'you : '
            : 'stranger : '}
        </span>
        {chat.message}
      </p>
    </div>
  );
};

export default Message;
