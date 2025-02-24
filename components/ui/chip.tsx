import React, { HTMLAttributes } from 'react';

const Chip = ({
   name,
   onClick,
   className,
   icon,
}: {
   name: string;
   onClick?: () => void;
   icon?: React.ReactNode;
   className?: HTMLAttributes<HTMLDivElement>['className'];
}) => {
   return (
      <div
         onClick={onClick}
         className={className + ' ' + 'px-[4px] font-medium rounded-lg w-fit'}
      >
         <div className="flex items-center justify-center gap-3">
            {icon}
            {name}
         </div>
      </div>
   );
};

export default Chip;
