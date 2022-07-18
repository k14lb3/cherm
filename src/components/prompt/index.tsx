import React from 'react';

interface PromptProps {
  input: string;
}

const Prompt: React.FC<PromptProps> = ({ input }) => {
  return (
    <div className="flex items-center">
      <label>[me@cherm] :&nbsp;</label>
      <p>{input}</p>
      <div className="h-[2.04290vh] w-[0.81716vh] bg-white animate-blink"></div>
    </div>
  );
};

export default Prompt;
