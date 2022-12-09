import { userConfigStore, wordStore } from '../store';
import { setWordList } from '../store/Actions';

export const ResetTest = async () => {
   const timerid = wordStore((state) => state.timerId);
   const { type } = userConfigStore((state) => state);

   if (timerid) {
      import(`../modules/TextFiles/${type}.json`).then((word) =>
         setWordList(word.default)
      );
   }
};
