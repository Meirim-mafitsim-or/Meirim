import React, { useState} from 'react';
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
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom"



async function update(families_id, selectedFamily, form) {

    const familiesCol = collection(db, 'familiesRegistration');
    const cur_families = doc(familiesCol, families_id);

    const FamiliesSnapshot = await getDoc(cur_families);
    const familiesData = FamiliesSnapshot.data();

    const families = familiesData.families;
    // const desiredFamily = families.find((check_family) =>_.isEqual(selectedFamily, check_family));
    const desiredFamily = families.find((check_family) => check_family.id === selectedFamily.id);
    
    // Update the name property of desiredFamily
    if (desiredFamily) {
      desiredFamily.first_name = form.first_name.value;
      desiredFamily.last_name = form.last_name.value;
      desiredFamily.city = form.city.value;
      desiredFamily.street = form.street.value;
      desiredFamily.house_number = form.house_number.value;
      desiredFamily.apartment_number = form.apartment_number.value;
      desiredFamily.phone_number = form.phone_number.value;
      desiredFamily.email = form.email.value;
      desiredFamily.special_comment = form.special_comment.value;


      // Update the family object in the Firebase Firestore database
      await updateDoc(cur_families, { families });

      console.log("Family updated:", desiredFamily);
    } else {
      console.log("Family not found");
    }


}

export default function EditFamily() {
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Track form submission status
  const { language } = React.useContext(LanguageContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { familiesId, selectedFamily, event_id } = location.state;



  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
      
    }

    setValidated(true);
    setSubmitted(true); // Set the submission status to true


    await update(familiesId, selectedFamily, form); // Wait for the update function to finish
    navigate(`/Families/${event_id}`)
  };
  
  return (
    <div className="App home-paragraph">
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
                defaultValue ={selectedFamily.first_name}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="last_name">
              <Form.Label>{strings.last_name[language]}</Form.Label>
              <Form.Control
                required
                type="text"
                defaultValue ={selectedFamily.last_name}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="city">
              <Form.Label>{strings.city[language]}</Form.Label>
              <Form.Control type="text" defaultValue ={selectedFamily.city} required />
              <Form.Control.Feedback type="invalid">
                {/* Please provide a valid city. */}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="street">
              <Form.Label>{strings.street[language]}</Form.Label>
              <Form.Control type="text" defaultValue ={selectedFamily.street} required />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="house_number">
              <Form.Label>{strings.house_number[language]}</Form.Label>
              <Form.Control type="number" defaultValue ={selectedFamily.house_number} required />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>
          
            <Form.Group as={Col} md="3" controlId="apartment_number">
              <Form.Label>{strings.apartment_number[language]}</Form.Label>
              <Form.Control type="number" defaultValue ={selectedFamily.apartment_number}  />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="phone_number">
              <Form.Label>{strings.phone_number[language]}</Form.Label>
              <Form.Control type="text" defaultValue ={selectedFamily.phone_number} required />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="email">
              <Form.Label>{strings.email[language]}</Form.Label>
              <Form.Control type="text" defaultValue ={selectedFamily.email} required />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>


          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="15" controlId="special_comment">
              <Form.Label>{strings.special_comment[language]}</Form.Label>
              <Form.Control as="textarea" defaultValue ={selectedFamily.special_comment} rows="4" />
            </Form.Group>
          </Row>


          <Form.Group className="mb-3">
          </Form.Group>
          <Button  type="submit" >{strings.save[language]}</Button>
  
        </Form>
      </Card.Body>
    </Card>
    </div>
  );
}
