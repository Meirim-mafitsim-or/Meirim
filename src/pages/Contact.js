import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import strings from '../static/Strings.json';
import { useContext, useState } from 'react';
import { LanguageContext } from '../common/LanguageContext';
import { addMessage } from '../common/Database';

function Contact() {
  const { language } = useContext(LanguageContext);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    let message = event.target.message.value;
    let email = event.target.email.value;
    let name = event.target.name.value;
    let phone_number = event.target.phone_number.value;
    let date = new Date();
    const messageData = {
      message: message,
      email: email,
      name: name,
      phone_number: phone_number,
      date: date,
    };
    addMessage(messageData);
    setSubmitted(true);
  };

  return (
    <div className="App home-paragraph home-color pt-5">
      <Card className="text-center w-75 m-auto" style={{ color: 'black' }}>
        <Card.Header>{strings.contact[language]}</Card.Header>
        <Card.Body>
          {submitted ? (
            <p>{strings.contact_submit_message[language]}</p>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col>
                  <Form.Control name="name" id='name' placeholder={strings.full_name[language]} />
                </Col>
                <Col>
                  <Form.Control name="email" id='email' placeholder={strings.email[language]} />
                </Col>
                <Col>
                  <Form.Control name="phone_number" id='phone_number' placeholder={strings.phone_number[language]} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Control name="message" id='message' placeholder={strings.message[language]}
                    as="textarea"
                    rows={3}
                  />
                </Col>
              </Row>
              <Button variant="primary" type="submit">
                {strings.send[language]}
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Contact;
