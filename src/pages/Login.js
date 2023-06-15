import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import strings from '../static/Strings.json';
import { useContext } from 'react';
import { LanguageContext } from '../common/LanguageContext';
import { useState } from "react";
import { app } from '../common/FirebaseApp';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {sendPasswordResetEmail } from "firebase/auth";
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';


function Login() {
  const { language } = useContext(LanguageContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(app);



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        navigate("/");
      })
        .catch((error) => {
          setErrorMessage(strings.authentication_error[language]); // Update the error message state
        });

    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      sendPasswordResetEmail(auth, email).then(() => {
        // Password reset email sent!
        // ..
      })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="home-paragraph mt-5">
      <Card className="text-center w-50 m-auto text-dark">
        <Card.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>{strings.email[language]}</Form.Label>
              <Form.Control
                type="email"
                placeholder={strings.email_placeholder[language]}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>{strings.login_password[language]}</Form.Label>
              <Form.Control
                type="password"
                placeholder={strings.login_password[language]}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {errorMessage && <p className="text-danger">{errorMessage}</p> /* Show error message */}
            {/* that the cols will be closer */}
            <Row>
              <Col className='col-lg-3'><Link onClick={handlePasswordReset}>{strings.forgot_password[language]}</Link></Col>
              <Col >
                <Button variant="primary" type="submit">
                {strings.login[language]}
              </Button>
              </Col>
              <Col className='col-lg-3'>
              </Col>
              
            </Row>
          
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;