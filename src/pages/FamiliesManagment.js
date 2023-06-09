import React from 'react';
import { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col,  } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import EventCard from "../common/EventCard";
import strings from '../static/Strings.json';
import { auth } from '../common/FirebaseApp';
import { db } from '../common/FirebaseApp';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


function FamiliesManagment(){

    const { language } = useContext(LanguageContext);
    const [Events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
          try {
            const eventsCollection = collection(db, 'events');
            const eventsSnapshot = await getDocs(eventsCollection);
            const events = eventsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
            const user = auth.currentUser;

            // Get the current date and time
            const currentDate = new Date();

            // Filter and sort the events array
            const noPassedEvents = events.filter(event => {
              // Convert the event date to a JavaScript Date object
              const eventDate = new Date(event.date.seconds * 1000);

              // Compare the event date with the current date
              return eventDate > currentDate;
            }).sort((a, b) => {
              // Sort the events by date in ascending order
              const dateA = new Date(a.date.seconds * 1000);
              const dateB = new Date(b.date.seconds * 1000);
              return dateA - dateB;
            });


            if (user) {
                const userDocRef = doc(collection(db, 'users'),user.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists() && userDocSnapshot.data().role === 'admin') {                    
                    setEvents(noPassedEvents);
                    return;
                }
            }
            const filteredEvents = [];
            eventsSnapshot.forEach((doc) => {
              const eventData = doc.data();
              const eventId = doc.id;

              if (eventData.hasOwnProperty("coordinator") && eventData.coordinator !== null)
              {
                if ( eventData.coordinator.id === user.uid) {
                    filteredEvents.push({
                        id: eventId,
                      ...eventData,
                    });
                  }
              }
              else{
                setEvents([]);
                return;
              }   
            });

            // Filter and sort the events array
            const noPassedFilteredEvents = filteredEvents.filter(event => {
              // Convert the event date to a JavaScript Date object
              const eventDate = new Date(event.date.seconds * 1000);

              // Compare the event date with the current date
              return eventDate > currentDate;
            }).sort((a, b) => {
              // Sort the events by date in ascending order
              const dateA = new Date(a.date.seconds * 1000);
              const dateB = new Date(b.date.seconds * 1000);
              return dateA - dateB;
            });
    
            setEvents(noPassedFilteredEvents);
          } catch (error) {
            console.error('Error fetching events:', error);
          }
        };
        fetchEvents();
    }, []);


    const navigateToEvent = useCallback(() => {
        if (Events.length === 1) {
          const event = Events[0];
          navigate(`/Families/${event.id}`);
        }
      }, [Events, navigate]);
      
      useEffect(() => {
        navigateToEvent();
      }, [navigateToEvent]);

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