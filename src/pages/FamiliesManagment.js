import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col,  } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import { db } from '../common/FirebaseApp';
import { collection, getDocs } from "firebase/firestore";
import EventCard from "../common/EventCard";
import strings from '../static/Strings.json';

export async function getEvents() {
    const EventsRef = collection(db, "events");
    const EventsSnapshot = await getDocs(EventsRef);
    const Events = EventsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
    return Events;
}

function FamiliesManagment(){

    const { language } = useContext(LanguageContext);
    const [Events, setEvents] = useState([]);

    useEffect(() => {
        getEvents().then(Events => setEvents(Events))
    }, []);

    return (
    
        <Container fluid>
            <div className='p-10'>
                <h1>{strings.events[language]}</h1>
                {   /* reshape the data to be 4 events per row */
                    Events.reduce((rows, key, index) => (index % 4 === 0 ? rows.push([key])
                        : rows[rows.length - 1].push(key)) && rows, [])
                        .map((row, index) => (
                            <Row key={index} xs={1} md={4} >
                                {row.map((event, index) => (
                                    <Col key={index} className="p-1 m-1">
                                        <EventCard event={event} forward={`${event.id}`} buttonText={strings.show_details[language]}/>
                                    </Col>
                                ))}
                            </Row>
                        ))
                }
            </div>
        </Container>

    );

}

export default FamiliesManagment;