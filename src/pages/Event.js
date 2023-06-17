import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';
import { doc, setDoc, } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { db } from '../common/FirebaseApp';
import { collection, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import { getFamiliesRegistration } from '../common/Database';
import { v4 as uuidv4 } from 'uuid';


export default function FormEvent() {
  let { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Track form submission status
  const [invalid, setInvalid] = useState({
    first_name: false,
    last_name: false,
    city: false,
    street: false,
    house_number: false,
    apartment_number: false,
    phone_number: false,
    email: false,
    special_comment: false,
  });
  const { language } = React.useContext(LanguageContext);
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [house_number, setHouse_number] = useState("");
  const [apartment_number, setApartment_number] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [email, setEmail] = useState("");
  const [special_comment, setSpecial_comment] = useState("");
  const navigate = useNavigate();
  const [familiesRegistration, setFamiliesRegistration] = useState([]);

  useEffect(() => {
    getFamiliesRegistration().then(FamiliesRegistration => setFamiliesRegistration(FamiliesRegistration))
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    // validate all fields
    let tmpInv = {
      first_name: false,
      last_name: false,
      city: false,
      street: false,
      house_number: false,
      apartment_number: false,
      phone_number: phone_number.match(/^[0-9]{10}$/) == null,
      email: email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) == null,
    };
    setInvalid(tmpInv);

    // if any field is invalid, don't submit
    if (Object.values(tmpInv).includes(true)) {
      setValidated(false);
      return;
    }

    setValidated(true);
    setSubmitted(true); // Set the submission status to true

    const famileyData = {
      first_name: first_name,
      last_name: last_name,
      city: city,
      street: street,
      house_number: house_number,
      apartment_number: apartment_number,
      phone_number: phone_number,
      email: email,
      special_comment: special_comment,
      id: uuidv4().substring(0, 9),
      confirmed: false,
      assigning: false,
      camper: null,
    };

    await addFamiley(famileyData, id);
    navigate("/");
  };
  async function addFamiley(famileyData, eventId) {
    const EventsRef = collection(db, "events");
    const EventsSnapshot = await getDocs(EventsRef);
    const Events = EventsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
    const event = Events.filter(event => event.id === eventId);
    const eventRegId = event[0].registrationId;//the refence to the registration collection

    for (let i = 0; i < familiesRegistration.length; i++) {
      if (familiesRegistration[i].id === eventRegId) {
        familiesRegistration[i].families.push(famileyData);
        await setDoc(doc(db, "familiesRegistration", eventRegId), {
          families: familiesRegistration[i].families
        });
      }
    }
  }


  return (
    <div className="home-paragraph m-0 mt-5">
      <Card className="text-center w-75 m-auto">
        <Card.Body>
          {submitted ? ( // Render the thank you message if the form is submitted
            <h3>{strings.registration_submit_message[language]}</h3>
          ) : (
            <>
              <h3>{strings.registration[language]}</h3>
              <Form validated={validated} onSubmit={handleSubmit} className='needs-validation'>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="first_name">
                    <Form.Label>{strings.first_name[language]}</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder={strings.first_name[language]}
                      onChange={(e) => setFirst_name(e.target.value)}
                      isInvalid={invalid.first_name}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="last_name">
                    <Form.Label>{strings.last_name[language]}</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder={strings.last_name[language]}
                      onChange={(e) => setLast_name(e.target.value)}
                      isInvalid={invalid.last_name}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="3" controlId="validationCustom04">
                    <Form.Label>{strings.street[language]}</Form.Label>
                    <Form.Control type="text" placeholder={strings.street[language]} required onChange={(e) => setStreet(e.target.value)}
                      isInvalid={invalid.street}
                    />
                    <Form.Control.Feedback type="invalid">
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationCustom03">
                    <Form.Label>{strings.city[language]}</Form.Label>
                    <Form.Control type="text" placeholder={strings.city[language]} required onChange={(e) => setCity(e.target.value)}
                      isInvalid={invalid.city} />
                    <Form.Control.Feedback type="invalid">
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationCustom05">
                    <Form.Label>{strings.house_number[language]}</Form.Label>
                    <Form.Control type="number" placeholder={strings.house_number[language]} required
                      onChange={(e) => setHouse_number(e.target.value)}
                      isInvalid={invalid.house_number} />
                    <Form.Control.Feedback type="invalid">
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="3" controlId="apartment_number">
                    <Form.Label>{strings.apartment_number[language]}</Form.Label>
                    <Form.Control type="number" placeholder={strings.apartment_number[language]}
                      onChange={(e) => setApartment_number(e.target.value)}
                      isInvalid={invalid.apartment_number} />
                    <Form.Control.Feedback type="invalid">
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom07">
                    <Form.Label>{strings.phone_number[language]}</Form.Label>
                    <Form.Control type="text" placeholder={strings.phone_number[language]} required
                      onChange={(e) => setPhone_number(e.target.value)}
                      isInvalid={invalid.phone_number} />
                    <Form.Control.Feedback type="invalid">
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom08">
                    <Form.Label>{strings.email[language]}</Form.Label>
                    <Form.Control type="text" placeholder={strings.email[language]} required
                      onChange={(e) => setEmail(e.target.value)}
                      isInvalid={invalid.email} />
                    <Form.Control.Feedback type="invalid">
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md="15" controlId="special_comment">
                    <Form.Label>{strings.special_comment[language]}</Form.Label>
                    <Form.Control as="textarea" placeholder={strings.special_comment[language]} rows="4"
                      onChange={(e) => setSpecial_comment(e.target.value)} />
                  </Form.Group>
                </Row>


                <Form.Group className="mb-3">
                </Form.Group>
                <Button type="submit">{strings.send[language]}</Button>

              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}