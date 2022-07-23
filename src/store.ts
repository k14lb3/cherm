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
  setUid: (uid: string) => void;
  setChat: (chat: Chat[]) => void;
  clearInput: () => void;
  addInput: () => void;
  addChar: (c: string) => void;
  deleteChar: () => void;
}

const useStore = create<StoreProps>((set) => ({
  uid: '',
  input: '',
  chat: [],
  setUid: (uid) => {
    set((state) => ({
      ...state,
      uid: uid,
    }));
  },
  setChat: (chat) => {
    set((state) => ({
      ...state,
      chat: chat,
    }));
  },
  clearInput: () => {
    set((state) => ({
      ...state,
      input: '',
    }));
  },
  addInput: () => {
    set((state) => ({
      ...state,
      chat: [...state.chat, { uid: state.uid, message: state.input }],
    }));
  },
  addChar: (char) => {
    set((state) => ({
      ...state,
      input: state.input + char,
    }));
  },
  deleteChar: () => {
    set((state) => ({
      ...state,
      input: state.input.slice(0, -1),
    }));
  },
}));

export default useStore;
