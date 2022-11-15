import { paragraphs } from '../Paragraphs';

const NUM_OF_WORDS: number = 30;
export const getText = () => {
   return paragraphs[0].split(' ', NUM_OF_WORDS);
};
