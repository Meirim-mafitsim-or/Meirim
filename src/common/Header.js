import './common.css';
import logo from '../static/logo.png';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useContext } from 'react';
import strings from '../static/Strings.json';
import { LanguageContext } from './LanguageContext';
import { Link } from 'react-router-dom';


export default function Header() {
  const { language, changeLanguage } = useContext(LanguageContext);
  const menuItems = [
    { link: "/", text: strings.home[language] },
    { link: "/Contact", text: strings.contact[language] },
    { link: "/About", text: strings.about[language] },
    { link: "/Families", text: strings.manage_and_placement[language] },

  ]
  const langItems = [
    { code: "he", text: "עברית" },
    { code: "en", text: "English" },
  ]
  return (
    <>
      <Navbar bg="light" expand="lg" sticky="top">
          <img src={logo} alt="logo" className="nav-logo" />
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {menuItems.map((item, index) => (<Nav.Link as={Link} key={index} to={item.link}>{item.text}</Nav.Link>))}
              <Navbar.Collapse className="justify-content-end"></Navbar.Collapse>
            </Nav>
            <Nav>
              <NavDropdown title={strings.language[language]} id="basic-nav-dropdown">
                {langItems.map((item, index) => (
                  <NavDropdown.Item key={index} onClick={() => changeLanguage(item.code)}>
                    {item.text}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <Nav.Link as={Link} to="/Login">{strings.login[language]}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
      </Navbar>
    </>
  )
}