import React, { useState, useEffect } from 'react'
import { paragraphs } from './Paragraphs'
import { MdLanguage } from 'react-icons/md'

const NUM_OF_WORDS = 30
const TimeSec = 60

const TextArea = () => {
      const [text, setText] = useState([])
      const [timer, setTimer] = useState(TimeSec)

      useEffect(() => {
            setText(getText())
      }, [])

      const getText = () => {
            return paragraphs[0].split(' ', NUM_OF_WORDS)
      }

      const startTimeCountDown = () => {

      }

      return (
            <div className='pt-20 font-poppins'>
                  <div className='flex items-center justify-center gap-x-3 lowercase tracking-widest'>
                        <MdLanguage />
                        <p className='cursor-pointer'>english</p>
                  </div>
                  <div className='flex flex-wrap p-6 sm:px-36 font-poppins text-2xl tracking-widest selection:bg-yellow-300 selection:text-white'>
                        <div className='absolute top-[165px] text-2xl font-medium font-poppins'>
                              {timer}
                        </div>
                        {React.Children.toArray(text.map((char) => {
                              return (
                                    <>
                                          <span>{char} </span>
                                          <pre> </pre>
                                    </>
                              )
                        }))}
                  </div>

                  <div className='pt-8 flex items-center justify-center'>
                        <input type="text" className='w-[50rem] focus:outline-none px-5 py-5 rounded-lg text-lg text-black' onKeyDown='
                        ' />
                  </div>

            </div>
      )
}

export default TextArea