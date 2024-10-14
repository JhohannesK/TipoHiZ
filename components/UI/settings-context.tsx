'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type SettingsContextType = {
   sound: boolean;
   toggleSound: () => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
   const [sound, setSound] = useState(true);

   const toggleSound = () => {
      setSound((prev) => !prev);
   };

   return (
      <SettingsContext.Provider value={{ sound, toggleSound }}>
         {children}
      </SettingsContext.Provider>
   );
}

export function useSettings() {
   const context = useContext(SettingsContext);
   if (context === undefined) {
      throw new Error('useSettings must be used within a SettingsProvider');
   }
   return context;
}
