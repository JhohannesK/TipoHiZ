import { wordStore } from '@/store';
import { resetStates } from '../store/actions/TimeActions';
import { setWordList } from '../store/actions/WordActions';

export const resetTest = async (type: string, reset: () => void) => {
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

export const resetAccuracy = () => {
   wordStore.setState(() => ({
      correctWord: 0,
      incorrectWord: 0,
   }));
};
