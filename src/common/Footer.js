import React from 'react';
import { Button , Row, Col, Modal } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import strings from '../static/Strings.json';


import Contact from '../pages/Contact';

export default function Footer() {
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { language } = React.useContext(LanguageContext);



    return (
        <footer className="footer">
            <small>© 2023 Meirim team developments. All rights reserved.</small>
            <Button variant="primary" onClick={handleShow}>
                {strings.contact[language]}
            </Button>
            <Contact show={show} handleClose={handleClose} />
        </footer>
    )
}