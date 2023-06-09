import React, { useContext, useState, useEffect } from 'react';
import { db } from './FirebaseApp';
import { collection, getDocs } from "firebase/firestore";
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';
import EventCard from './EventCard';
import { Row, Col } from 'react-bootstrap';
import { UserContext } from './UserContext';
import { getEvents } from './Database';

// export async function getEvents() {
//     const EventsRef = collection(db, "events");
//     const EventsSnapshot = await getDocs(EventsRef);
//     const Events = EventsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
//     return Events;
// }

export default function EventsList() {
    const { language } = useContext(LanguageContext);
    const [Events, setEvents] = useState([]);
    const { user } = useContext(UserContext);


    useEffect(() => {
        let now = new Date();//get the date of today and add the events that are not over yet
        getEvents().then(Events => Events.filter(event => event.date.seconds > now.getTime() / 1000))
        .then(events=> setEvents(events));
    }, []);

    // if user role:admin he dont have the button event card instead he have the button EditShabat
    const cards_per_row = 3;

    return (
        <div className='p-10'>
            <h1>{strings.events[language]}</h1>
            {   /* reshape the data to be 4 events per row */
                Events.reduce((rows, key, index) => (index % cards_per_row === 0 ? rows.push([key])
                    : rows[rows.length - 1].push(key)) && rows, [])
                    .map((row, index) => (
                        <Row key={index} xs={1} md={cards_per_row} >
                            {row.map((event, index) => (
                                <Col key={index} className="p-1">
                                    {user ? (
                                    <EventCard event={event} forward={`EditShabat/${event.id}`} buttonText={strings.edit_shabat[language]} />
                                    ) : (
                                    <EventCard event={event} forward={`Event/${event.id}`} buttonText={strings.reg_host[language]} />
                                    )}
                                </Col>
                                ))}
                        </Row>
                    ))
            }
        </div>
    )
}