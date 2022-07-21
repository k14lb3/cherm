import React from 'react';
import useStore from '@/store';

const Prompt: React.FC = () => {
  const input = useStore((state) => state.input);

  return (
    <p className="whitespace-pre-wrap break-all">
      <span className="font-bold">[me@cherm] → </span>
      {input}
      <span className="animate-blink">█</span>
    </p>
  );
};

export default Prompt;
