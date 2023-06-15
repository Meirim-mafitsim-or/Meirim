import React, { useState, useContext } from 'react';
import { Row, Col, Modal, Button, Form, FloatingLabel} from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import strings from '../static/Strings.json';
import Select from 'react-select';
import citys from '../static/city.json';
import { createCoordinator } from '../common/Database';


const campers_columns = ['first_name', 'last_name', 'email', 'phone', 'place_name'];
export default function AddCoordinatorModal({onSuccess ,show, setShow}) {
    const { language } = useContext(LanguageContext);
    const [camper, setCamper] = useState(campers_columns.reduce((obj, key) => ({ ...obj, [key]: '' }), {}));
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const handleClose = () => setShow(false);
    const [place_name, setPlace_name] = useState("");
    const [validated, setValidated] = useState(false);
    const [invalid, setInvalid] = useState({
        first_name: false,
        last_name: false,
        phone: false,
        // email: false,
        place_name: false,
    });

    const citysOptions = citys.values.map((city, index) => {
        if (language === "he") {
          return { "value": city.name, "label": city.name }
        }
        else {
          return { "value": city.english_name, "label": city.english_name }
        }
    
      });
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

        const onSuccessfulAdd = () => {
            handleClose();
            setCamper(campers_columns.reduce((obj, key) => ({ ...obj, [key]: '' }), {}));
            setInvalid({
                first_name: false,
                last_name: false,
                phone: false,
                place_name: false,
            });
            setValidated(false);
            setPassword("");
            setPlace_name("");
            onSuccess();
        };
        let place_en = "";
        if(language === "he"){
            place_en =citys.values.filter(city => city.name === place_name).map(city => city.english_name)[0];
        }
        camper['place_name'] = place_en;
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        // validate all fields
        let tmpInv = {
          first_name: false,
          last_name: false,
          phone: camper.phone.match(/^[0-9]{10}$/) == null,
        //   email: campers_columns["email"].match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) == null,
          place_name: false,
        };
        if(camper.first_name === ""){
            tmpInv.first_name = true;
        }
        if(camper.last_name === ""){
            tmpInv.last_name = true;
        }
        if(place_name === ""){
            tmpInv.place_name = true;
        }
        setInvalid(tmpInv);
        
        // if any field is invalid, don't submit
        if (Object.values(tmpInv).includes(true)) {
          setValidated(false);
          return;
        }
        // camper['events'] = [];//the coordinator have list of events
        setValidated(true);
        await createCoordinator(camper, handleError, onSuccessfulAdd,password);
        
    };


    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{strings.add_coordinator[language]}</Modal.Title>
                </Modal.Header>
                <Form validated={validated} className='needs-validation' onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className='mb-3'>
                            <Col>
                                <FloatingLabel label={strings.first_name[language]} controlId='formFirstName'>
                                    <Form.Control type="text" name="first_name" value={camper.first_name} onChange={handleInputChange} placeholder='FirstName'
                                    isInvalid={invalid.first_name} required 
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel controlId="formLastName" label={strings.last_name[language]}>
                                    <Form.Control type="text" name="last_name" value={camper.last_name} onChange={handleInputChange} placeholder='LastName' required 
                                    isInvalid={invalid.last_name}   />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                        <Col>
                                <FloatingLabel controlId="formPhone" label={strings.phone_number[language]}>
                                    <Form.Control type="text" name="phone" value={camper.phone} onChange={handleInputChange} placeholder='DisabilityRank' required 
                                    isInvalid={invalid.phone}   />
                                </FloatingLabel>
                            </Col>
                            <Col>
                            <Form.Label>{strings.place_name[language]}</Form.Label>
                                <FloatingLabel controlId="formPlaceName">
                                <Select options={citysOptions}
                                    onChange={(e) => { setPlace_name(e.value) }}
                                    placeholder={strings.select[language]}
                                    isInvalid={invalid.place_name}
                                    required
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
                        <Button type="submit" className='mr-3' variant="primary">
                            {strings.add[language]}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

