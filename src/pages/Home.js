import React from 'react';
import SlidePicture from '../common/SlidePicture';
import pic1 from '../static/1.jpg';
import pic2 from '../static/2.jpg';
import pic3 from '../static/3.jpg';
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';
import EventsList from "../common/EventsList"

export default function Home() {
    const { language } = React.useContext(LanguageContext);
    return (
        <div className = "home-color">
            <EventsList />
            <SlidePicture pics={[pic1,pic2,pic3]} />
            <div className="App home-paragraph ">
                <h1>{strings.about_title[language]}</h1>
                <p>{strings.about_text[language]}</p>
            </div>
            
        </div> 
   )
}