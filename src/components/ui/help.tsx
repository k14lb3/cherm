import React from 'react';
import { Notification } from '@/components/ui';

const help = [
  {
    command: 'search    ',
    action:
      'search for a stranger to chat with (press <Ctrl+z> to stop searching)',
  },
];

interface HelpProps {
  key?: React.Key;
}

export const Help: React.FC<HelpProps> = ({ key }) => {
  return (
    <React.Fragment key={key}>
      <Notification
        className="mb-2"
        subClassName="break-all"
        text="usage : cherm <command>"
      />
      <Notification
        className="mb-2"
        subClassName="break-all"
        text="commands :"
      />
      {help.map(({ command, action }) => (
        <Notification
          className="mb-2"
          subClassName="break-all"
          text={` ${command}${action}`.replaceAll(' ', '\u00a0')}
        />
      ))}
    </React.Fragment>
  );
};
