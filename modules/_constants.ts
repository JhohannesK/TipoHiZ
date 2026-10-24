import { IConstants } from './_types';

const Constants: IConstants = {
   TimeSec: 30,
   WordCount: 10,
   options: {
      type: ['default', 'punctuation', 'numbers'],
      category: ['time', 'words'],
      time: [15, 30, 60, 120],
      words: [10, 25, 50, 100],
   },
};

export default Constants;
