import React, { useEffect } from 'react';
import useStore from '@/store';
import Prompt from '@/components/prompt';

const ChatBox: React.FC = () => {
  const store = useStore();

  useEffect(() => {
    const keydownEvents = (e: KeyboardEvent) => {
      const c = e.key;

      switch (c) {
        case ' ':
          store.addChar(' ');
          break;
        default:
          if (c.length === 1) {
            store.addChar(e.key);
          }
      }
    };
    window.addEventListener('keydown', keydownEvents);

    return () => {
      window.removeEventListener('keydown', keydownEvents);
    };
  }, []);
  return (
    <div className="flex-grow p-4 mt-4 border-solid border-[0.025rem] border-white rounded">
      <Prompt input={store.input} />
    </div>
  );
};

export default ChatBox;
