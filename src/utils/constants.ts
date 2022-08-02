export interface Command {
  help: string;
  search: string;
}

export const command: Command = {
  help: 'cherm help',
  search: 'cherm search',
};

export interface Notification {
  initial: string;
  chatting: string;
  disconnect: {
    me: string;
    stranger: string;
  };
}

export const notification: Notification = {
  initial: "type 'cherm help' to display available commands.",
  chatting:
    'you are now chatting with a random stranger. (press <Ctrl+z> to exit chat)',
  disconnect: {
    me: 'you have disconnected.',
    stranger: 'stranger has disconnected.',
  },
};

export const ps1 = '[me@cherm] → ';
