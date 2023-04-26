import React from 'react';
import {db} from './FirebaseApp';
import { collection, getDocs } from "firebase/firestore";
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';


async function getEvents() {
    const EventsRef = collection(db, "events");
    const EventsSnapshot = await getDocs(EventsRef);
    const Events = EventsSnapshot.docs.map(doc => doc.data());
    return Events;
}


export default function EventsList() {
    const { language, changeLanguage } = React.useContext(LanguageContext);
    const [Events, setEvents] = React.useState([]);
    React.useEffect(() => {
        getEvents().then(Events => setEvents(Events));
    }, []);

    return (
        <div>
            <h1>{strings.events[language]}</h1>
            <ul>
                {Events.map((event,index) => <li key={index} >{event.settlement}</li>)}
            </ul>
        </div>
    )
}