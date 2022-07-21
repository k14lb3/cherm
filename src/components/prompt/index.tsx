import React from 'react';
import useStore from '@/store';

interface PromptProps {
  cursor: boolean;
}

const Prompt: React.FC<PromptProps> = ({ cursor }) => {
  const input = useStore((state) => state.input);

  return (
    <p className="whitespace-pre-wrap break-all">
      <span className="font-bold">[me@cherm] → </span>
      {input}
      {cursor && <span className="animate-blink">█</span>}
    </p>
  );
};

export default Prompt;
