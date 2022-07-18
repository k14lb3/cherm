import React from 'react';

interface PromptProps {
  input: string;
}

const Prompt: React.FC<PromptProps> = ({ input }) => {
  return (
    <p className="break-all">
      <span>[me@cherm] :&nbsp;</span>
      {input}
      <span className="animate-blink">█</span>
    </p>
  );
};

export default Prompt;
