import create from 'zustand';

interface StoreProps {
  ip: string;
  input: string;
  conversation: { id: string; message: string }[];
  setIp: (ip: string) => void;
  clearInput: () => void;
  addInput: () => void;
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
  clearInput: () => {
    set((state) => ({
      ...state,
      input: '',
    }));
  },
  addInput: () => {
    set((state) => ({
      ...state,
      conversation: [
        ...state.conversation,
        { id: state.ip, message: state.input },
      ],
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
