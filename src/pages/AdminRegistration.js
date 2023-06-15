import React, { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import strings from '../static/Strings.json';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { createAdmin} from '../common/Database';

export default function AddCamperModal({onSuccess}) {
    const { language } = useContext(LanguageContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");


    const navigate = useNavigate();
  

    const handleError = (errorCode) => {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                setErrorMessage(strings.email_already_in_use[language]);
                break;
            case 'auth/invalid-email':
                setErrorMessage(strings.invalid_email[language]);
                break;
            case 'auth/weak-password':
                setErrorMessage(strings.weak_password[language]);
                break;
            default:
                setErrorMessage(strings.create_user_error[language]);
                break;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const onSuccessfulAdd = () => {
            // handleClose();
            onSuccess();
        };
        let registration = {
            first_name: first_name,
            last_name: last_name,
            email: email,
        }
        await createAdmin(registration, handleError, onSuccessfulAdd,password);
        navigate("/");
      };

    return (
        <div className="home-paragraph mt-5">
        <Card className="text-center w-50 m-auto text-dark">
          <Card.Body>
            <Form onSubmit={handleLogin}>
               <Form.Group className="mb-3" controlId="formFirstName">
                <Form.Label>{strings.first_name[language]}</Form.Label>
                <Form.Control
                    type="text"
                    placeholder={strings.first_name[language]}
                    name="first_name"
                    value={first_name}
                    onChange={(e) => setFirst_name(e.target.value)}
                />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label>{strings.last_name[language]}</Form.Label>
                <Form.Control

                    type="text"
                    placeholder={strings.last_name[language]}
                    name="last_name"
                    value={last_name}
                    onChange={(e) => setLast_name(e.target.value)}
                />
                </Form.Group>
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
              <Button variant="primary" type="submit">
                {strings.sign_up[language]}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
}

