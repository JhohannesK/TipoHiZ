import { StateCreator } from 'zustand';
import { PersistOptions } from 'zustand/middleware';
import type { Keystroke } from '../lib/stats/types';

export interface WordState {
   disabled: boolean;
   activeWord: string;
   userInput: string;
   nextChar: string;
   wordList: string[];
   caretRef: React.RefObject<HTMLSpanElement | null> | null;
   activeWordRef: React.RefObject<HTMLDivElement | null> | null;
   typedHistory: string[];
   nextIndex: number;
   nextCharIdx: number;
   typedEntries: number;
   errorCount: number;
   keystrokeLog: Keystroke[];
}

export interface TimeState {
   timerId: NodeJS.Timer | null | number;
   timer: number;
   isRunning: boolean;
}

export interface IuserConfig {
   time: number;
   wordCount: number;
   theme: string;
   type: string;
   category: string;
   sound: boolean;
   language: string;
}

export type MyPersist = (
   config: StateCreator<IuserConfig>,
   options: PersistOptions<IuserConfig>
) => StateCreator<IuserConfig>;
