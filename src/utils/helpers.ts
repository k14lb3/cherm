import { randomBytes } from 'crypto';
import { Command, command } from '@/utils/constants';

// https://github.com/googleapis/nodejs-firestore/blob/4f4574afaa8cf817d06b5965492791c2eff01ed5/dev/src/util.ts#L52
export const autoId = (): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';

  while (autoId.length < 20) {
    const bytes = randomBytes(40);
    bytes.forEach((b) => {
      const maxValue = 62 * 4 - 1;
      if (autoId.length < 20 && b <= maxValue) {
        autoId += chars.charAt(b % 62);
      }
    });
  }

  return autoId;
};

export const isCommand = (input: string) => input.split(' ')[0] === "cherm";

export const isValidCommand = (input: string) => {
  const commands = Object.keys(command).map(
    (key) => command[key as keyof Command],
  );

  if (commands.includes(input)) return true;

  return false;
};
