import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import strings from '../static/Strings.json';
import { useContext, useState } from 'react';
import { LanguageContext } from '../common/LanguageContext';
import { addMessage } from '../common/Database';
import { Spinner } from 'react-bootstrap';

function Contact({ show, handleClose }) {
  const { language } = useContext(LanguageContext);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (event) => {
    setSubmitted(true);
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
    setTimeout(() => {
    handleClose();
    setSubmitted(false);
    }, 1000);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{strings.contact[language]}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {submitted ? (
            <p>{strings.contact_submit_message[language]}</p>
          ) : (<>
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
          </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {strings.close[language]}
          </Button>
          <Button variant="primary" type="submit">
            {strings.send[language]}
            {submitted && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> }
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default Contact;
