import React from 'react';
import { Notification } from '@/components/ui';

const help = [
  {
    command: 'help      ',
    action: 'display available commands',
  },
  {
    command: 'search    ',
    action:
      'search for a stranger to chat with (press <Ctrl+z> to stop searching)',
  },
];

interface HelpProps {
  parentKey: React.Key;
}

export const Help: React.FC<HelpProps> = ({ parentKey }) => {
  return (
    <>
      <Notification className="mb-2" text="usage : cherm <command>" />
      <Notification className="mb-2" text="commands :" />
      {help.map(({ command, action }) => (
        <Notification
          key={parentKey + '-help-' + command}
          className="mb-2"
          text={` ${command}${action}`.replaceAll(' ', '\u00a0')}
        />
      ))}
    </>
  );
};
