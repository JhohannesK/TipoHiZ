import { userConfigStore, wordStore } from '../store';
import { resetTest, setWordList } from '../store/actions/ConfigActions';

export const ResetTest = async (
   timerid: number | NodeJS.Timer | null,
   type: string
) => {
   if (timerid) {
      import(`../modules/TextFiles/${type}.json`).then((word) =>
         setWordList(word.default)
      );
      resetTest();
   }
};
