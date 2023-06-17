import React from 'react';
import SlidePicture from '../common/SlidePicture';
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';
import EventsList from "../common/EventsList"
import Map from "../common/Map"
import { Col, Row, Container } from 'react-bootstrap';
import Vidio1 from "../static/vidio_1.mp4";
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

export default function Home() {
  const { language } = React.useContext(LanguageContext);
  
  return (
    <div className="home-color">
      <Container fluid>
        <Row className='justify-content-md-center' style={{
          color: 'lightgray',
          textAlign: 'center',
          fontSize: '50px',
          fontWeight: 'bold',
          fontFamily: 'Arial'
        }}>
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
                <h1 className="display-1">{strings.main_title[language]}</h1>
                <ButtonBase className="btn btn-outline-light" href="#events" sx={{ borderRadius: '8px', padding: '16px 32px', border: '2px solid white', width: 'fit-content' }}>
                  <Typography variant="subtitle1" color="inherit" sx={{fontSize: '42px'}} >
                    {strings.all_events[language]}
                  </Typography>
                </ButtonBase>
              </div>
            </div>
          </Row>
        </Row>
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
        <div id="events">
          <Row className='justify-content-md-center m-2 mt-5'>
            <EventsList />
          </Row>
        </div>
      </Container>
    </div>
  )
}
