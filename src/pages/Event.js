import React, { useState, useEffect} from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';
import { useLocation,useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, getDoc, collection } from 'firebase/firestore';
import { db } from '../common/FirebaseApp';

export default function FormExample() {
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Track form submission status
  const { language } = React.useContext(LanguageContext);
  const [pathSuffix, setPathSuffix] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  
  useEffect(() => {
    const path = location.pathname;
    const parts = path.split('/');
    const suffix = parts[parts.length-1];
    setPathSuffix(suffix);
  }, [location]);


  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setSubmitted(true); // Set the submission status to true


    const events = collection(db, 'events');
    const cur_event = doc(events, pathSuffix);
    const EventsSnapshot = await getDoc(cur_event);
    const eventData = EventsSnapshot.data();
    const familiesDocRef = eventData.families; // Assuming families is a DocumentReference
    const familiesDocSnapshot = await getDoc(familiesDocRef);
    
    // Get the name of the familiesDoc document
    const familiesDocName = familiesDocSnapshot.id;
    const familiesCol = collection(db, 'familiesRegistration');
    const cur_families = doc(familiesCol, familiesDocName);
    // Create the new map object
    const newFamily = {
      "first_name" : form.first_name.value,
      "last_name" : form.last_name.value,
      "city" : form.city.value,
      "street": form.street.value,
      "house_number": form.house_number.value,
      "apartment_number": form.apartment_number.value,
      "phone_number": form.phone_number.value,
      "email": form.email.value,
      "special_comment": form.special_comment.value,
      "confirmed": false
    };
    try {
      // Update the array field with the new map using arrayUnion
      await updateDoc(cur_families, {
        families: arrayUnion(newFamily),
      });
      console.log('New map added successfully!');
    } catch (error) {
      console.error('Error adding new map:', error);
    }
    navigate(`/`)
  };

  return (
    <div className="App home-paragraph home-color text-dark pt-5">
    <Card className="text-center w-75 m-auto">
      <Card.Body>
      {submitted ? ( // Render the thank you message if the form is submitted
            <p>{strings.registration_submit_message[language]}</p>
          ) : (
            <p>{strings.registration[language]}</p>
          )}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="first_name">
              <Form.Label>{strings.first_name[language]}</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder={strings.first_name[language]}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="last_name">
              <Form.Label>{strings.last_name[language]}</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder={strings.last_name[language]}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="3"  controlId="city">
              <Form.Label>{strings.city[language]}</Form.Label>
              <Form.Control type="text" placeholder={strings.city[language]} required />
              <Form.Control.Feedback type="invalid">
                {/* Please provide a valid city. */}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="street">
              <Form.Label>{strings.street[language]}</Form.Label>
              <Form.Control type="text" placeholder={strings.street[language]} required />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="house_number">
              <Form.Label>{strings.house_number[language]}</Form.Label>
              <Form.Control type="number" placeholder={strings.house_number[language]} required />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>
          
            <Form.Group as={Col} md="3" controlId="apartment_number">
              <Form.Label>{strings.apartment_number[language]}</Form.Label>
              <Form.Control type="number" placeholder={strings.apartment_number[language]}  />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="phone_number">
              <Form.Label>{strings.phone_number[language]}</Form.Label>
              <Form.Control type="text" placeholder={strings.phone_number[language]} required />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="email">
              <Form.Label>{strings.email[language]}</Form.Label>
              <Form.Control type="text" placeholder={strings.email[language]} required />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>


          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="15" controlId="special_comment">
              <Form.Label>{strings.special_comment[language]}</Form.Label>
              <Form.Control as="textarea" placeholder={strings.special_comment[language]} rows="4" />
            </Form.Group>
          </Row>


          <Form.Group className="mb-3">
          </Form.Group>
          <Button type="submit">{strings.send[language]}</Button>
  
        </Form>
      </Card.Body>
    </Card>
    </div>
  );
}
