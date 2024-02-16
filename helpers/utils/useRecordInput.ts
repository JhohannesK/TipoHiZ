import { wordStore } from '@/store';
import { useHandleText } from './useHandleText';

export default function useRecordInput() {
   const { activeWordRef } = wordStore((state) => state);

   document.onkeydown = (e) => {
      console.log("🚀 ~ useRecordInput ~ e:", e)
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Tab') {
         useHandleText(e.key, e.ctrlKey, activeWordRef);
         e.preventDefault();
      }
   };
   return () => {
      document.onkeydown = null;
   };
}
