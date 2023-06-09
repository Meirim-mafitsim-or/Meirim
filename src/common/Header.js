import './common.css';
import logo from '../static/logo.png';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useContext } from 'react';
import strings from '../static/Strings.json';
import { LanguageContext } from './LanguageContext';
import { UserContext } from './UserContext';
import { Link, useNavigate } from 'react-router-dom';


export default function Header() {
  const { language, changeLanguage } = useContext(LanguageContext);
  const { user, logout} = useContext(UserContext);
  const navigate = useNavigate();
  const menuItems = [
    { link: "/", text: strings.home[language] },
    { link: "/Contact", text: strings.contact[language] },
    { link: "/About", text: strings.about[language] },
  ]
  const langItems = [
    { code: "he", text: "עברית" },
    { code: "en", text: "English" },
  ]

  const handleLogout = () => {
    navigate("/")
    logout();
  }
  return (
    <>
      <Navbar bg="light" expand="lg" sticky="top">
      <Link to="/">
        <img src={logo} alt="logo" className="nav-logo" />
      </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {menuItems.map((item, index) => 
              (<Nav.Link as={Link} key={index} to={item.link}>{item.text}</Nav.Link>))}
              {user && <Nav.Link as={Link} to="/CreatShabat">{strings.creat_shabat[language]}</Nav.Link>}
              {user ? <Nav.Link as={Link} to="/DataReport">{strings.data_reports[language]}</Nav.Link> : null}
              <NavDropdown title={strings.management_users[language]} id="basic-nav-dropdown">
              {user ? <Nav.Link as={Link} to="/manageCampers">{strings.manage_campers[language]}</Nav.Link> : null}
              {user ? <Nav.Link as={Link} to="/ManageCoordinators">{strings.manage_coordinators[language]}</Nav.Link> : null}
              </NavDropdown>
              <Navbar.Collapse className="justify-content-end"></Navbar.Collapse>
            </Nav>
            {/* <Nav.Brand className="nav-brand">{user ? "user" : ""}</Nav.Brand> */}
            <Nav>
              <NavDropdown title={strings.language[language]} id="basic-nav-dropdown">
                {langItems.map((item, index) => (
                  <NavDropdown.Item key={index} onClick={() => changeLanguage(item.code)}>
                    {item.text}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              {user ? <Nav.Link onClick={handleLogout}>{strings.logout[language]}</Nav.Link> :
                      <Nav.Link as={Link} to="/Login">{strings.login[language]}</Nav.Link>
              }
              {user && <Nav.Link as={Link} to="/AdminRegistration">{strings.sign_up[language]}</Nav.Link>}
            </Nav>
          </Navbar.Collapse>
      </Navbar>
    </>
  )
}