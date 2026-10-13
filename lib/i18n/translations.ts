export type Language = 'english' | 'spanish' | 'french';

export interface Translations {
   settings: {
      title: string;
      description: string;
      sound: string;
      language: string;
      theme: string;
   };
   common: {
      reset: string;
   };
}

export const translations: Record<Language, Translations> = {
   english: {
      settings: {
         title: 'Settings',
         description: 'Select your preferred settings.',
         sound: 'Sound:',
         language: 'Language:',
         theme: 'Theme:',
      },
      common: {
         reset: 'Reset',
      },
   },
   spanish: {
      settings: {
         title: 'Configuración',
         description: 'Seleccione su configuración preferida.',
         sound: 'Sonido:',
         language: 'Idioma:',
         theme: 'Tema:',
      },
      common: {
         reset: 'Reiniciar',
      },
   },
   french: {
      settings: {
         title: 'Paramètres',
         description: 'Sélectionnez vos paramètres préférés.',
         sound: 'Son:',
         language: 'Langue:',
         theme: 'Thème:',
      },
      common: {
         reset: 'Réinitialiser',
      },
   },
};

export const languageOptions = [
   { value: 'english', label: 'English' },
   { value: 'spanish', label: 'Español' },
   { value: 'french', label: 'Français' },
];
