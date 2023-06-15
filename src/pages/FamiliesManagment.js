import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col,  } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import EventCard from "../common/EventCard";
import strings from '../static/Strings.json';
import { auth } from '../common/FirebaseApp';
import { db } from '../common/FirebaseApp';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';


function FamiliesManagment(){

    const { language } = useContext(LanguageContext);
    const [Events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
          try {
            const eventsCollection = collection(db, 'events');
            const eventsSnapshot = await getDocs(eventsCollection);
            const events = eventsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
            const user = auth.currentUser;
            console.log(user)
            if (user) {
                const userDocRef = doc(collection(db, 'users'),user.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists() && userDocSnapshot.data().role === 'admin') {                    
                    setEvents(events);
                    return;
                }
            }
            const filteredEvents = [];
            console.log(user)
            eventsSnapshot.forEach((doc) => {
              const eventData = doc.data();
              if (eventData.hasOwnProperty("coordinator") && eventData.coordinator !== null)
              {
                if ( eventData.coordinator.id === user.uid) {
                    filteredEvents.push({
                      ...eventData,
                    });
                  }
              }
              else{
                setEvents([]);
                return;
              }   
            });
    
            setEvents(filteredEvents);
          } catch (error) {
            console.error('Error fetching events:', error);
          }
        };
    
        fetchEvents();
      }, []);
      
      console.log(Events)


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