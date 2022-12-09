import { paragraphs } from '../modules/TextFiles/Paragraphs';

const NUM_OF_WORDS: number = 30;
export const getText = () => {
   return paragraphs[Math.floor(Math.random() * paragraphs?.length)]?.split(
      ' ',
      NUM_OF_WORDS
   );
};
