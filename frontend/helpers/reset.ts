import { userConfigStore, wordStore } from '../store';
import { setWordList } from '../store/Actions';

export const ResetTest = async (
   timerid: number | NodeJS.Timer | null,
   type: string
) => {
   if (timerid) {
      import(`../modules/TextFiles/${type}.json`).then((word) =>
         setWordList(word.default)
      );
   }
};
