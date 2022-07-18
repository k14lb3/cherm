import create from 'zustand';

interface StoreProps {
  input: string;
  enterInput: () => void;
  addChar: (c: string) => void;
  deleteChar: () => void;
}

const useStore = create<StoreProps>((set) => ({
  input: '',
  enterInput: () => {
    set((state) => ({
      ...state,
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
