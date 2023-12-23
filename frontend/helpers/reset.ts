import { resetTest } from "../store/actions/TimeActions";
import { setWordList } from "../store/actions/WordActions";

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
