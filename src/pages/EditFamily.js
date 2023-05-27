import React, { useState, useEffect} from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';
import { db } from '../common/FirebaseApp';
import { updateDoc } from 'firebase/firestore';
import { collection, doc, getDoc} from "firebase/firestore"; 
import { useLocation, Link } from 'react-router-dom';


async function update(event_id, id, form) {
  
    console.log(event_id);
    const events = collection(db, 'events');
    const cur_event = doc(events, event_id);
    const EventsSnapshot = await getDoc(cur_event);
    const eventData = EventsSnapshot.data();
    const families = eventData.families;
    const desiredFamily = families.find((check_family) => id === check_family.id);


    // Update the name property of desiredFamily
    if (desiredFamily) {
      desiredFamily.first_name = form.first_name;

      // Update the family object in the Firebase Firestore database
      await updateDoc(cur_event, { families });

      console.log("Family updated:", desiredFamily);
    } else {
      console.log("Family not found");
    }
}

export default function EditFamily() {
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Track form submission status
  const { language } = React.useContext(LanguageContext);
  const [pathSuffix, setPathSuffix] = useState('');


  useEffect(() => {
      const path = location.pathname;
      const parts = path.split('/');
      const suffix = parts[parts.length-1];
      setPathSuffix(suffix);
  }, [location]);

  const location = useLocation();
  const { family } = location.state;
  console.log(family);
  const id = family.id;  

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    setSubmitted(true); // Set the submission status to true
    await update(pathSuffix, id, form); // Wait for the update function to finish
    
  };
  
  return (
    <div className="App home-paragraph home-color text-dark pt-5">
    <Card className="text-center w-75 m-auto">
      <Card.Body>
      {submitted ? ( // Render the confirm nessage when the coordinator finished edit
            <p>{strings.edited_confirm_message[language]}</p>
          ) : (
            <p>{strings.editing[language]}</p>
          )}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="first_name">
              <Form.Label>{strings.first_name[language]}</Form.Label>
              <Form.Control
                required
                type="text"
                defaultValue ={family.first_name}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="last_name">
              <Form.Label>{strings.last_name[language]}</Form.Label>
              <Form.Control
                required
                type="text"
                defaultValue ={family.last_name}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom03">
              <Form.Label>{strings.city[language]}</Form.Label>
              <Form.Control type="text" defaultValue ={family.city} required />
              <Form.Control.Feedback type="invalid">
                {/* Please provide a valid city. */}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom04">
              <Form.Label>{strings.street[language]}</Form.Label>
              <Form.Control type="text" defaultValue ={family.street} required />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom05">
              <Form.Label>{strings.house_number[language]}</Form.Label>
              <Form.Control type="number" defaultValue ={family.house_number} required />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>
          
            <Form.Group as={Col} md="3" controlId="apartment_number">
              <Form.Label>{strings.apartment_number[language]}</Form.Label>
              <Form.Control type="number" defaultValue ={family.apartment_number}  />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom07">
              <Form.Label>{strings.phone_number[language]}</Form.Label>
              <Form.Control type="text" defaultValue ={family.phone_number} required />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom08">
              <Form.Label>{strings.email[language]}</Form.Label>
              <Form.Control type="text" defaultValue ={family.email} required />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>


          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="15" controlId="special_comment">
              <Form.Label>{strings.special_comment[language]}</Form.Label>
              <Form.Control as="textarea" defaultValue ={family.special_comment} rows="4" />
            </Form.Group>
          </Row>


          <Form.Group className="mb-3">
          </Form.Group>
          <Button  type="submit" >{strings.send_and_confirm[language]}</Button>
  
        </Form>
      </Card.Body>
    </Card>
    </div>
  );
}

