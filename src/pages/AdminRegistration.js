import React, { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import strings from '../static/Strings.json';
import { collection, getDocs } from "firebase/firestore";
import { db, firebaseConfig } from '../common/FirebaseApp';
import { doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Card from 'react-bootstrap/Card';
import { createCoordinator } from '../common/Database';

// async function addCoordinator(registration, setError, onSuccessfulAdd,password) {
//     const users = collection(db, 'users');
//     const secondaryApp = initializeApp(firebaseConfig, "Secondary");
//     const tempAuth = getAuth(secondaryApp);
//     createUserWithEmailAndPassword(tempAuth, registration.email, password).then(async (userCredential) => {
//         // Signed in 
//         const user = userCredential.user;
//         tempAuth.signOut();
//         registration.role = "admin";
        
//         await setDoc(doc(users,user.uid), registration);
//         getDocs(doc(users,user.uid)).then((doc) => { console.log(doc.data()) });
//         onSuccessfulAdd();
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         setError(errorCode);
//       });
// }

const campers_columns = ['first_name', 'last_name', 'email', 'phone', 'password', 'place_name'];
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
        await createCoordinator(registration, handleError, onSuccessfulAdd,password);
        navigate("/");
      };

    return (
        <div className="App home-paragraph home-color pt-5">
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

