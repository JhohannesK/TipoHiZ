import { resetStates } from '../store/actions/TimeActions';
import { setWordList } from '../store/actions/WordActions';
import { userConfigStore } from '../store';

export const resetTest = async (type: string, reset: () => void) => {
   document
      .querySelectorAll('.wrong, .right')
      .forEach((el) => el.classList.remove('wrong', 'right'));

   const { language } = userConfigStore.getState();

   try {
      if (language !== 'english') {
         if (type === 'default') {
            const wordModule = await import(
               `../modules/TextFiles/${language}.json`
            );
            setWordList(wordModule.default);
         } else if (type === 'punctuation') {
            try {
               const wordModule = await import(
                  `../modules/TextFiles/${language}_punctuation.json`
               );
               setWordList(wordModule.default);
            } catch (error) {
               console.log(error);
               const wordModule = await import(
                  `../modules/TextFiles/punctuation.json`
               );
               setWordList(wordModule.default);
            }
         } else {
            const wordModule = await import(
               `../modules/TextFiles/${type}.json`
            );
            setWordList(wordModule.default);
         }
      } else {
         const wordModule = await import(`../modules/TextFiles/${type}.json`);
         setWordList(wordModule.default);
      }
   } catch (error) {
      // Fallback to default if any file doesn't exist
      console.error(
         `Failed to load word list for ${language}/${type}, falling back to default`,
         error
      );
      const wordModule = await import(`../modules/TextFiles/default.json`);
      setWordList(wordModule.default);
   }

   document.getElementsByClassName('startView')[0].scrollIntoView();
   reset();
   resetStates();
};
