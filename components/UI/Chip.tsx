import React from 'react';

const Chip = ({ name }: { name: string }) => {
   return (
      <div className="px-[4px] font-medium bg-purple-400 rounded-lg w-fit">
         {name}
      </div>
   );
};

export default Chip;
