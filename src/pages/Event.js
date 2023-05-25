import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';


export default function FormExample() {
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Track form submission status
  const { language } = React.useContext(LanguageContext);


  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    setSubmitted(true); // Set the submission status to true
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
            <Form.Group as={Col} md="3" controlId="validationCustom03">
              <Form.Label>{strings.city[language]}</Form.Label>
              <Form.Control type="text" placeholder={strings.city[language]} required />
              <Form.Control.Feedback type="invalid">
                {/* Please provide a valid city. */}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom04">
              <Form.Label>{strings.street[language]}</Form.Label>
              <Form.Control type="text" placeholder={strings.street[language]} required />
              <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom05">
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
            <Form.Group as={Col} md="4" controlId="validationCustom07">
              <Form.Label>{strings.phone_number[language]}</Form.Label>
              <Form.Control type="text" placeholder={strings.phone_number[language]} required />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom08">
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
