import { StateCreator } from 'zustand';
import { PersistOptions } from 'zustand/middleware';

export interface WordState {
   disabled: boolean;
   activeWord: string;
   userInput: string;
   nextChar: string;
   wordList: string[];
   caretRef: React.RefObject<HTMLSpanElement> | null;
   activeWordRef: React.RefObject<HTMLDivElement> | null;
   typedHistory: string[];
   nextIndex: number;
   nextCharIdx: number;
   typedEntries: number;
   errorCount: number;
}

export interface TimeState {
   timerId: NodeJS.Timer | null | number;
   timer: number;
   isRunning: boolean;
}

export interface IuserConfig {
   time: number;
   theme: string;
   type: string;
   category: string;
   sound: boolean;
}

export type MyPersist = (
   config: StateCreator<IuserConfig>,
   options: PersistOptions<IuserConfig>,
) => StateCreator<IuserConfig>;
