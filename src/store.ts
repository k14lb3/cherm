import create from 'zustand';

interface StoreProps {
  uid: string;
  input: string;
  chat: { uid: string; message: string }[];
  setUid: (uid: string) => void;
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
  clearInput: () => {
    set((state) => ({
      ...state,
      input: '',
    }));
  },
  addInput: () => {
    set((state) => ({
      ...state,
      chat: [
        ...state.chat,
        { uid: state.uid, message: state.input },
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
