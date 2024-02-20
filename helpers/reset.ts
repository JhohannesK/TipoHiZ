import { resetStates } from '../store/actions/TimeActions';
import { setWordList } from '../store/actions/WordActions';

export const resetTest = async (type: string, reset: () => void) => {
   console.log('reset being called');
   document
      .querySelectorAll('.wrong, .right')
      .forEach((el) => el.classList.remove('wrong', 'right'));
   import(`../modules/TextFiles/${type}.json`).then((word) =>
      setWordList(word.default)
   );
   document.getElementsByClassName('startView')[0].scrollIntoView();
   reset();
   resetStates();
};
