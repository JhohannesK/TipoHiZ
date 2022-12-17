import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { MdLanguage } from 'react-icons/md';
import { BsArrowRepeat } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { setActiveWord, setTime, setUserInput } from '../store/Actions';
import TextArea from './TextArea';
import { useHotkeys } from 'react-hotkeys-hook';
import UserSelectPallete from './UserSelectPallete';
import { State } from '../store/@types.';
import { userConfigStore, wordStore } from '../store';
import useGetStatefromStorage from '../helpers/utils/useZustandHook';
import { ResetTest } from '../helpers/reset';
// import Timer, { startTimeCountDown } from '../modules/Timer';

const HomePage = () => {
  const timerid = wordStore((state) => state.timerId);
  const { type } = userConfigStore((state) => state);
  useHotkeys('tab', () => {
    ResetTest(timerid, type);
    document.getElementsByClassName('word')[0].scrollIntoView();
  });

  // const { time } = wordStore(({ time }) => ({ time }));

  const time = useGetStatefromStorage(
    userConfigStore,
    (state: any) => state.time
  );

  return (
    <div className="xl:max-w-6xl mx-auto font-poppins">
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

      <div className="pt-8 flex items-center justify-center space-x-4">
        <BsArrowRepeat
          className="hover:rotate-180 transition-all duration-500 ease-out cursor-pointer active:scale-150 active:text-green-300"
          size={30}
          onClick={(e) => {
            e.preventDefault();
            // setTime(time);
            ResetTest(timerid, type);
            setUserInput('');
          }}
        />
      </div>
    </div>
  );
};

export default HomePage;
