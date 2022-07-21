import React, { useEffect } from 'react';
import useStore from '@/store';
import Prompt from '@/components/prompt';

const ChatBox: React.FC = () => {
  const uid = useStore((state) => state.uid);
  const input = useStore((state) => state.input);
  const conversation = useStore((state) => state.conversation);
  const clearInput = useStore((state) => state.clearInput);
  const addInput = useStore((state) => state.addInput);
  const addChar = useStore((state) => state.addChar);
  const deleteChar = useStore((state) => state.deleteChar);

  useEffect(() => {
    const keydownEvents = (e: KeyboardEvent) => {
      const c = e.key;

      switch (c) {
        case 'Enter':
          addInput();
          clearInput();
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
      {uid && (
        <>
          {conversation.map(({ uid, message }) => (
            <div className="mb-2">
              <p>
                <span className="font-bold">
                  {uid === uid ? 'you' : 'stranger'} :{' '}
                </span>
                {message}
              </p>
            </div>
          ))}
          <Prompt input={input} />
        </>
      )}
    </div>
  );
};

export default ChatBox;
