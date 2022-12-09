import { type } from 'os';
import { StateCreator } from 'zustand';
import { PersistOptions } from 'zustand/middleware';

export interface State {
   disabled: boolean;
   activeWord: number;
   userInput: string;
   timerId: NodeJS.Timer | null | number;
   wordList: string[];
   caretRef: React.RefObject<HTMLSpanElement> | null;
}

export interface IuserConfig {
   time: number;
   theme: string;
   type: string;
   category: string;
}

export type MyPersist = (
   config: StateCreator<IuserConfig>,
   options: PersistOptions<IuserConfig>
) => StateCreator<IuserConfig>;
