import React, { useState, useEffect } from 'react';
import useStore from '@/store';
import { ps1 } from '@/utils/constants';

interface PromptProps {
  cursorState: [
    {
      visible: boolean;
      pos: number;
    },
    React.Dispatch<
      React.SetStateAction<{
        visible: boolean;
        pos: number;
      }>
    >,
  ];
}

const Prompt: React.FC<PromptProps> = ({ cursorState }) => {
  const input = useStore((state) => state.input);
  const [cursor, setCursor] = cursorState;

  const moveCursorLeft = () => {
    if (cursor.pos === 0) return;

    setCursor((cursor) => ({ ...cursor, pos: cursor.pos-- }));
  };

  const moveCursorRight = () => {
    if (cursor.pos === input.length) return;

    setCursor((cursor) => ({ ...cursor, pos: cursor.pos++ }));
  };

  useEffect(() => {
    const keydownEvents = (e: KeyboardEvent) => {
      const c = e.key;

      switch (c) {
        case 'ArrowLeft':
          return moveCursorLeft();
        case 'ArrowRight':
          return moveCursorRight();
      }
    };

    window.addEventListener('keydown', keydownEvents);

    return () => {
      window.removeEventListener('keydown', keydownEvents);
    };
  }, [cursor.pos]);

  const renderPrompt = () => (
    <span className="relative">
      <span className="font-bold">{ps1}</span>
      {cursor.pos !== 0 && input.slice(0, cursor.pos)}
      {(cursor.pos !== 0 || input[cursor.pos] !== ' ') && (
        <span className="animate-text-under-cursor">{input[cursor.pos]}</span>
      )}
      {cursor.pos < input.length && input.slice(cursor.pos + 1, input.length)}
    </span>
  );

  const renderCursor = () => (
    <span className="absolute inset-0 select-none">
      <span className="invisible">{'_'.repeat(ps1.length + cursor.pos)}</span>
      <span className="animate-blink visible">█</span>
    </span>
  );

  return (
    <div className="relative">
      <p className="whitespace-pre-wrap break-all">
        {cursor.visible && renderCursor()}
        {renderPrompt()}
      </p>
    </div>
  );
};

export default Prompt;
