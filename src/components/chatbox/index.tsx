import React, { useEffect } from 'react';
import useStore from '@/store';
import Prompt from '@/components/prompt';

const ChatBox: React.FC = () => {
  const input = useStore((state) => state.input);
  const enterInput = useStore((state) => state.enterInput);
  const addChar = useStore((state) => state.addChar);
  const deleteChar = useStore((state) => state.deleteChar);

  useEffect(() => {
    const keydownEvents = (e: KeyboardEvent) => {
      const c = e.key;

      switch (c) {
        case 'Enter':
          enterInput();
          break;
        case 'Backspace':
          deleteChar();
          break;
        case ' ':
          addChar(' ');
          break;
        default:
          if (c.length === 1) {
            addChar(e.key);
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
      <Prompt input={input} />
    </div>
  );
};

export default ChatBox;
