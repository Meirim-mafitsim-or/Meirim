
import React from 'react';
import strings from '../static/Strings.json';
import { useContext } from 'react';
import { LanguageContext } from '../common/LanguageContext';


export default function About() {
    const { language } = useContext(LanguageContext);

    return (
        
        <div className="App home-paragraph home-color">
            <h1>{strings.about_title[language]}</h1>
            <p>{strings.about_text[language]}</p>
        </div>
    )

}

    
    
        



