import { Timestamp } from 'firebase/firestore';
import create from 'zustand';

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
  clearInput: () => void;
  addInput: () => void;
  addChar: (c: string) => void;
  deleteChar: () => void;
  setRoomId: (id: string) => void;
}

const useStore = create<StoreProps>((set, get) => ({
  uid: '',
  input: '',
  chat: [],
  roomId: '',
  setUid: (uid) => {
    set({ uid: uid });
  },
  setChat: (chat) => {
    set({ chat: chat });
  },
  clearInput: () => {
    set({ input: '' });
  },
  addInput: () => {
    set({ chat: [...get().chat, { uid: get().uid, message: get().input }] });
  },
  addChar: (char) => {
    set({ input: get().input + char });
  },
  deleteChar: () => {
    set({ input: get().input.slice(0, -1) });
  },
  setRoomId: (id) => {
    set({ roomId: id });
  },
}));

export default useStore;
