import TextArea from '@/components/TextArea';
import UserSelectPallete from '@/components/UserSelectPallete';
import ResetTestButton from '@/components/reset-test-button';
import { MdLanguage } from 'react-icons/md';

export default function HomePage() {
   return (
      <div>
         <UserSelectPallete />
         <div className="flex items-center mt-16 justify-between sm:px-10">
            {/* Time display */}
            <div className="text-2xl font-medium font-poppins text-emerald-400">
               {/* <Timer /> */}
            </div>
            <div className="flex items-center justify-center gap-x-3 lowercase tracking-widest">
               <MdLanguage />
               <p className="cursor-pointer">english</p>
            </div>
         </div>
         <TextArea />
         <ResetTestButton />
      </div>
   );
}
