import React from 'react';
import SlidePicture from '../common/SlidePicture';
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';
import EventsList from "../common/EventsList"
import Map from "../common/Map"
import { Col, Row, Container } from 'react-bootstrap';
import Vidio1 from "../static/vidio_1.mp4";
import { Button } from 'react-bootstrap';
import updateAssigning from "../common/updateAssigning"


export default function Home() {
    updateAssigning();
    const { language } = React.useContext(LanguageContext);
    return (
        <div className="home-color">
            <Container fluid >
                {/*small backgroung color and a button that bring to all the events that in the bottom */}
                <Row className='justify-content-md-center' style={
                    {
                        // opacity: '0.8',
                        color: 'lightgray',
                        textAlign: 'center',
                        fontSize: '50px',
                        fontWeight: 'bold',
                        fontFamily: 'Arial'
                    }
                }>
                    <Row className='justify-content-md-center p-0'>
                        <div className="video-banner p-0 video-container" style={{
                            position: 'relative',
                            height: '70vh',
                            backgroundColor: 'black',
                        }}>
                            <video className="video" autoPlay loop muted style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                position: 'relative',
                                zIndex: '0'
                            }}>
                                <source src={Vidio1} type="video/mp4" />
                            </video>
                            <div className="video-overlay" style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                zIndex: '1',
                                background: 'rgba(0,0,0,0.5)',
                                width: '100%',
                                height: '100%',
                                paddingRight: '2vw',
                                paddingTop: '35vh',
                                textAlign: 'start',
                            }}>
                                {/* <div className="video-content"> */}
                                    <h1 style={{
                                        fontSize: '5vw',
                                        fontFamily: 'fantasy',
                                    }}>{strings.welcome[language]}</h1>
                                    <Button className="btn-primary" href="#events">{strings.all_events[language]}</Button>
                                {/* </div> */}
                            </div>
                        </div>
                    </Row>


                </Row>
                {/* //between the two rows more space */}
                <Row className='mt-5'>
                    <Col>
                        <h1 className='mb-5'>{strings.was_there[language]}</h1>
                        <Map />
                    </Col>
                    <Col>
                        <h1 className='mb-5'>{strings.slide_pic[language]}</h1>
                        <SlidePicture />
                    </Col>
                </Row>

                {/* //the button that bring to all the events that in the bottom can to be here */}
                <div id="events">
                    <Row className='justify-content-md-center m-2 mt-5'>
                        <EventsList />
                    </Row>
                </div>
            </Container>
        </div>
    )
}