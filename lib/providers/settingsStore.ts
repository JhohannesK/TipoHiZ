import create from 'zustand';

type SettingsState = {
   sound: boolean;
   toggleSound: () => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
   sound: false,
   toggleSound: () => set((state) => ({ sound: !state.sound })),
}));
