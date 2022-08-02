import create from 'zustand';
import { Timestamp } from 'firebase/firestore';
import { notification } from '@/utils/constants';

export interface Chat {
  timestamp?: Timestamp;
  uid: string;
  message: string;
}

interface StoreProps {
  uid: string;
  input: string;
  chat: Chat[];
  roomId: string;
  setUid: (uid: string) => void;
  setChat: (chat: Chat[]) => void;
  setInput: (input: string) => void;
  enterInput: () => void;
  clearInput: () => void;
  setRoomId: (id: string) => void;
}

const useStore = create<StoreProps>((set, get) => ({
  uid: '',
  input: '',
  chat: [{ uid: 'system', message: notification.initial }],
  roomId: '',
  setUid: (uid) => {
    set({ uid: uid });
  },
  setChat: (chat) => {
    set({ chat: chat });
  },
  setInput: (input) => {
    set({ input: input });
  },
  enterInput: () => {
    set({ chat: [...get().chat, { uid: get().uid, message: get().input }] });
  },
  clearInput: () => {
    set({ input: '' });
  },
  setRoomId: (id) => {
    set({ roomId: id });
  },
}));

export default useStore;
