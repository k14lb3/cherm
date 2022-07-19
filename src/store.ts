import create from 'zustand';

interface StoreProps {
  ip: string;
  input: string;
  conversation: { id: string; message: string }[];
  setIp: (ip: string) => void;
  enterInput: () => void;
  addChar: (c: string) => void;
  deleteChar: () => void;
}

const useStore = create<StoreProps>((set) => ({
  ip: '',
  input: '',
  conversation: [],
  setIp: (ip) => {
    set((state) => ({
      ...state,
      ip: ip,
    }));
  },
  enterInput: () => {
    set((state) => ({
      ...state,
      conversation: [
        ...state.conversation,
        { id: state.ip, message: state.input },
      ],
      input: '',
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
