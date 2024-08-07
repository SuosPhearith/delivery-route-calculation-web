"use client";
import { Languages } from "@/translations";
import { useState, useEffect } from "react";
import Image from "next/image";

const LanguageSwitcher: React.FC = () => {
  const [language, setLanguage] = useState<Languages>(Languages.EN);

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") as Languages;
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  const changeLanguage = (lang: Languages) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    window.location.reload();
  };

  return (
    <div className="h-full w-[30px] rounded-full border-2 border-primary p-[2px]">
      {language === Languages.EN ? (
        <div
          className="h-full w-full cursor-pointer"
          onClick={() => changeLanguage(Languages.KH)}
        >
          <Image
            src="/images/flag/flag-kh.png"
            alt="English"
            width={100}
            height={100}
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className="h-full w-full cursor-pointer"
          onClick={() => changeLanguage(Languages.EN)}
        >
          <Image
            src="/images/flag/flag-en.png"
            alt="English"
            width={100}
            height={100}
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
