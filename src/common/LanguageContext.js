import React, {createContext , useState} from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("he");
    const changeLanguage = (newLanguage) => {
      setLanguage(newLanguage);
    };
  
    return (
      <LanguageContext.Provider value={{ language, changeLanguage }}>
        {children}
      </LanguageContext.Provider>
    );
  };



