import React from 'react';

export type Language = 'en' | 'sizang' | 'my';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English'
  },
  {
    code: 'sizang',
    name: 'Sizang',
    nativeName: 'Sizang'
  },
  {
    code: 'my',
    name: 'Burmese',
    nativeName: 'မြန်မာ'
  }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name} ({language.nativeName})
          </option>
        ))}
      </select>
    </div>
  );
}; 