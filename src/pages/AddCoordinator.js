import React, { useEffect, useState, useContext } from 'react';
import { Accordion, Container, Row, Col, Modal, Button, Form, FloatingLabel, Spinner, FormControl } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import strings from '../static/Strings.json';
import { collection, getDocs } from "firebase/firestore";
import { db, storage,auth, firebaseConfig } from '../common/FirebaseApp';
import { async } from '@firebase/util';
import { doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { on } from 'events';
import Select from 'react-select';
import citys from '../static/city.json';


async function addCoordinator(coordinatorData, setError, onSuccessfulAdd,password) {
    const coordinator = collection(db, 'coordinators');
    const secondaryApp = initializeApp(firebaseConfig, "Secondary");
    const tempAuth = getAuth(secondaryApp);

    createUserWithEmailAndPassword(tempAuth, coordinatorData.email, password).then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        tempAuth.signOut();

        const userCollection = collection(db, 'users');
        const userData = {
            ...coordinatorData,
            role: "coordinator",
        }
            
        await setDoc(doc(userCollection,user.uid), userData);

        coordinatorData.userId = user.uid;
        await setDoc(doc(coordinator), coordinatorData);
        onSuccessfulAdd();
      })
      .catch((error) => {
        const errorCode = error.code;
        setError(errorCode);
      });
}

const campers_columns = ['first_name', 'last_name', 'email', 'phone', 'place_name'];
export default function AddCoordinatorModal({onSuccess ,show, setShow}) {
    const { language } = useContext(LanguageContext);
    // const [show, setShow] = useState(false);
    const [camper, setCamper] = useState(campers_columns.reduce((obj, key) => ({ ...obj, [key]: '' }), {}));
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [place_name, setPlace_name] = useState("");

    const citysOptions = citys.values.map((city, index) => {
        if (language === "he") {
          return { "value": city.name, "label": city.name }
        }
        else {
          return { "value": city.english_name, "label": city.english_name }
        }
    
      });

    const navigate = useNavigate();
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCamper({ ...camper, [name]: value });
    };


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
                console.log(errorCode);
                setErrorMessage(strings.create_user_error[language]);
                break;
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log(camper);
        const onSuccessfulAdd = () => {
            setCamper(campers_columns.reduce((obj, key) => ({ ...obj, [key]: '' }), {}));
            handleClose();
            onSuccess();
        };
        let place_en = "";
        if(language === "he"){
            place_en =citys.values.filter(city => city.name === place_name).map(city => city.english_name)[0];
        }
        camper['place_name'] = place_en;
        await addCoordinator(camper, handleError, onSuccessfulAdd,password);
    };


    return (
        <>
          
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{strings.add_coordinator[language]}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className='mb-3'>
                            <Col>
                                <FloatingLabel label={strings.first_name[language]} controlId='formFirstName'>
                                    <Form.Control type="text" name="first_name" value={camper.first_name} onChange={handleInputChange} placeholder='FirstName' required />
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel controlId="formLastName" label={strings.last_name[language]}>
                                    <Form.Control type="text" name="last_name" value={camper.last_name} onChange={handleInputChange} placeholder='LastName' required />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                        <Col>
                                <FloatingLabel controlId="formPhone" label={strings.phone_number[language]}>
                                    <Form.Control type="text" name="phone" value={camper.phone} onChange={handleInputChange} placeholder='DisabilityRank' required />
                                </FloatingLabel>
                            </Col>
                            <Col>
                            <Form.Label>{strings.place_name[language]}</Form.Label>
                                <FloatingLabel controlId="formPlaceName">
                                <Select options={citysOptions}
                                    onChange={(e) => { setPlace_name(e.value) }}
                                    placeholder={strings.select[language]}
                                />
                                </FloatingLabel>
                            </Col>
                        </Row>

        
                        <Row className='mb-3'>
                            <Col>
                                <FloatingLabel controlId="formEmail" label={strings.email[language]}>
                                    <Form.Control type="email" name="email" value={camper.email} onChange={handleInputChange} placeholder='Age' required />
                                </FloatingLabel>
                            </Col>
                            
                            <Col>
                                <FloatingLabel controlId="formPassword" label={strings.login_password[language]}>
                                    <Form.Control type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='DisabilityRank' required />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        {errorMessage && <p className="text-danger">{errorMessage}</p> /* Show error message */}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            {strings.close[language]}
                        </Button>
                        <Button className='mr-3' variant="primary" onClick={handleSubmit}>
                            {strings.add[language]}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

