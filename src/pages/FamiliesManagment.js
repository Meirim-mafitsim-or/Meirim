import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col,  } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import EventCard from "../common/EventCard";
import strings from '../static/Strings.json';
import { getEvents } from '../common/Database';


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
                                    <Col key={index} className="p-1">
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