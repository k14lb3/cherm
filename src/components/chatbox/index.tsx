import React, { useEffect, useState } from 'react';
import useStore from '@/store';
import { command } from '@/utils/constants';
import Prompt from '@/components/prompt';

const ChatBox: React.FC = () => {
  const uid = useStore((state) => state.uid);
  const input = useStore((state) => state.input);
  const chat = useStore((state) => state.chat);
  const clearInput = useStore((state) => state.clearInput);
  const addInput = useStore((state) => state.addInput);
  const addChar = useStore((state) => state.addChar);
  const deleteChar = useStore((state) => state.deleteChar);
  const [searching, setSearching] = useState<boolean>(false);
  const [cursor, setCursor] = useState<boolean>(true);

  const search = async () => {};

  const parseInput = (input: string) => {
    if (input === command.search) {
      setSearching(true);
      search();
      setCursor(false);
      return;
    }

    addInput();
    clearInput();
  };

  useEffect(() => {
    const keydownEvents = (e: KeyboardEvent) => {
      if (searching) {
        if (e.ctrlKey && e.key.toLowerCase() === 'c') {
          setSearching(false);
          clearInput();
          setCursor(true);
        }
        return;
      }

      const c = e.key;

      switch (c) {
        case 'Enter':
          parseInput(input);
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
  }, [input, searching]);

  return (
    <div className="flex-grow p-4 mt-4 border-solid border-[0.025rem] border-white rounded">
      {uid && (
        <>
          {chat.map(({ uid, message }) => (
            <div className="mb-2">
              <p>
                <span className="font-bold">
                  {uid === uid ? 'you' : 'stranger'} :{' '}
                </span>
                {message}
              </p>
            </div>
          ))}
          <Prompt cursor={cursor} />
          {searching && (
            <p className="three-dot-loader mt-2 text-gray">
              searching for a stranger...
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ChatBox;
