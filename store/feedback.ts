import { create } from 'zustand';

interface FeedbackUiState {
   open: boolean;
   testActive: boolean;
}

export const feedbackStore = create<FeedbackUiState>()(() => ({
   open: false,
   testActive: false,
}));
