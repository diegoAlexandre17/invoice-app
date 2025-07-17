import React from "react";
import { useTranslation } from "../hooks/useTranslation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const LanguageSwitcher: React.FC = () => {
  const { changeLanguage, currentLanguage } = useTranslation();

  const languages = [
    { code: "en", name: "English", flag: "EN" },
    { code: "es", name: "Español", flag: "ES" },
  ];

  const handleLanguageChange = (value: string) => {
    changeLanguage(value);
  };

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="">
        <SelectValue>
          {languages.find((lang) => lang.code === currentLanguage)?.flag}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
