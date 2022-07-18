import create from 'zustand';

interface StoreProps {
  input: string;
  addChar: (c: string) => void;
}

const useStore = create<StoreProps>((set) => ({
  input: '',
  addChar: (char) => {
    set((state) => ({
      ...state,
      input: state.input + char,
    }));
  },
}));

export default useStore;
