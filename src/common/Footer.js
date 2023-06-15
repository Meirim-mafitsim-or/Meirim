import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../common/LanguageContext';
import strings from '../static/Strings.json';
import logo from '../static/logo.png';


import Contact from '../pages/Contact';

export default function Footer() {
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { language } = React.useContext(LanguageContext);



    return (
        //the logo bring to the link of the home page


        <footer className="footer">
            <Link to="/">
            <img src={logo} alt="logo" style={
                {
                    width: "70px",
                    height: "70px",
                    marginLeft: "10px",
                }
            } />
            </Link>
            <Button variant="link" onClick={handleShow} style={
                {
                    color: "blue",
                    marginLeft: "10px",
                    marginRight: "10px",
                }
            }>{strings.contact[language]}</Button>

            <Contact show={show} handleClose={handleClose} />
        </footer>
    )
}
