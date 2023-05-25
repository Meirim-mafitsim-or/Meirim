import React from 'react';
import SlidePicture from '../common/SlidePicture';
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';
import EventsList from "../common/EventsList"
import Map from "../common/Map"
import { Col, Row, Container } from 'react-bootstrap';


export default function Home() {

    const { language } = React.useContext(LanguageContext);
    return (
        <div className = "home-color">
            <Container fluid >
                <Row className='justify-content-md-center m-2'>
                    <EventsList/>
                </Row>
                <Row>
                    <Col>
                        <h1>{strings.was_there[language]}</h1>
                        <Map/>
                    </Col>
                    <Col >
                        <h1>{strings.slide_pic[language]}</h1>
                        <SlidePicture/>
                    </Col>
                </Row>
            </Container>
        </div> 
   )
}