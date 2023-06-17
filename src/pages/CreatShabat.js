import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';
import Select from 'react-select';
import citys from '../static/city.json';
import { doc, setDoc, getDoc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../common/FirebaseApp';
import { collection } from "firebase/firestore";
import AddCoordinator from './AddCoordinator';
import Spinner from 'react-bootstrap/Spinner';
import { getCampers, getCoordinators } from '../common/Database';
import InputGroup from 'react-bootstrap/InputGroup';


async function createAssigningDoc(settlement) {
  // Get a reference to the Firestore collection
  const collectionRef = collection(db, 'assignings');

  const data = {
    assignings: [{
      familyName: "",
      phoneNumber: "",
      campersId: []
    }]
  };

  const docRef = doc(collectionRef, settlement);
  // Check if the document already exists
  const docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists()) {
    return;
  }
  await setDoc(doc(collectionRef, settlement), data);
}


export default function FormCreatShabat() {
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Track form submission status
  const { language } = React.useContext(LanguageContext);
  const [Campers, setCampers] = useState([]);
  const [place_name, setPlace_name] = useState("");
  const [date, setDate] = useState(Date());
  const [choosenCampers, setChoosenCampers] = useState([]);
  const [choosenCoordinator, setChoosenCoordinators] = useState([]);
  const navigate = useNavigate();
  const [Coordinators, setCoordinators] = useState([]);
  const [showCoordinatorModal, setShowCoordinatorModal] = useState(false);
  const [invalid, setInvalid] = useState({
    place_name: false,
    date: false,
    // choosenCampers: false,
    choosenCoordinator: false,
    image: false,
  });



  useEffect(() => {
    getCampers().then(Campers => setCampers(Campers))
    getCoordinators().then(Coordinators => setCoordinators(Coordinators))
  }, []);

  /* ----------------------------------------for the option--------------------------------------------- */
  const citysOptions = citys.values.map((city, index) => {
    if (language === "he") {
      return { "value": city.english_name, "label": city.name }
    }
    else {
      return { "value": city.english_name, "label": city.english_name }
    }

  });

  const options = Campers.map((camper, index) => ({
    "value": camper, "label": camper.firstName
  }));

  const optionsCoordinators = Coordinators.map((coordinator, index) => ({
    "value": coordinator, "label": coordinator.first_name + " " + coordinator.last_name + " - " + coordinator.place_name
  }));

  

  /* ----------------------------------------after submit--------------------------------------------- */


  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    let tmpInv = {
      place_name: false,
      date: false,
      // choosenCampers: false,
      choosenCoordinator: false,
      image: false,
    };
    // Check if the required fields are not selected
    if (!place_name) {
      tmpInv.place_name = true;
    }
    // if (choosenCampers.length === 0) {
    //   tmpInv.choosenCampers = true;
    // }
    if (!choosenCoordinator) {
      tmpInv.choosenCoordinator = true;
    }
    setInvalid(tmpInv);

    // if any field is invalid, don't submit
    if (Object.values(tmpInv).includes(true)) {
      setValidated(false);
      return;
    }

    setValidated(true);
    setSubmitted(true); // Set the submission status to true

    const imageFile = event.target.image.files[0]; // Get the image file from the input field
    const storageRef = ref(storage, "settlements/" + imageFile.name); // Create a storage reference with the desired file name
    await uploadBytes(storageRef, imageFile);// Upload the image file to Firestore storage
    const downloadURL = await getDownloadURL(storageRef);// Get the download URL of the uploaded image



    let city_he = place_name;
    if (language === "he") {
      setPlace_name(citys.values.filter(city => city.name === city_he).map(city => city.english_name)[0]);
    }
    const id = await createRegistration();

    const campersField = choosenCampers.map((camper, index) => ({
      id: camper.value.id,//here add id
      familie: "",
      assigning: false,
    }));  

    const shabatData = {
      settlement: place_name,
      date: new Date(date),
      image: downloadURL,
      coordinator: choosenCoordinator.value,
      campers: campersField,
      registrationId: id.id,
      families: [],
    };

    await addShabat(shabatData);
    createAssigningDoc(place_name)
    navigate("/");
  };

  async function addShabat(shabatData) {
    const events = collection(db, 'events');
    //take the id of the new event and add it to the campers
    await addDoc(events, shabatData);
    // let idEvent = id.id;
    // //add this id event to the coordinator
    // const usersRef = doc(db, 'users', choosenCoordinator.value.id);
    // await setDoc(usersRef, {
    //   events: [...choosenCoordinator.value.events, idEvent]
    // }, { merge: true });    
  }
  async function createRegistration() {
    let registration = {
      families: [],
      settlement: place_name,
    }
    const addRegistration = collection(db, 'familiesRegistration');
    // await setDoc(doc(addRegistration), registration);
    let id = await addDoc(addRegistration, registration);
    return id;
  }

  /* ----------------------------------------creat shabat form--------------------------------------------- */
  return (
    <div className="home-paragraph">
      <Card className="text-center w-75 m-auto mt-5">
        <Card.Body>
          {submitted ? ( // Render the thank you message if the form is submitted
            <p>{strings.registration_submit_message[language]}</p>
          ) : (
            <h3 className='mb-3'>{strings.creat_shabat[language]}</h3>
          )}
          <Form validated={validated} onSubmit={handleSubmit} className='needs-validation'>
            {/* place */}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="place_name">
                <div className="container">
                  <div className="m-auto w-100">
                    {/* <Form.Label>{strings.place_name[language]}</Form.Label> */}
                    <Select options={citysOptions}
                      onChange={(e) => { setPlace_name(e.value) }}
                      placeholder={strings.select_place[language]}
                      isInvalid={invalid.place_name}
                      required
                    />
                  </div>
                </div>
              </Form.Group>
            </Row>
            {/* choose campers */}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationCustom05">
                <div className="container">
                  <div className="m-auto w-100">
                    {/* <Form.Label>{strings.campers[language]}</Form.Label> */}
                    {/* select first all the campers and than can delete the one you dont want */}
                    <Select
                      isMulti
                      onChange={(e) => setChoosenCampers(e)}
                      options={options}
                      placeholder={strings.select_campers[language]}
                      // isInvalid={invalid.choosenCampers}
                      // required
                    />
                  </div>
                </div>
              </Form.Group>
            </Row>
            {/* choose coordinator */}
            <Row className="mb-3">
              {/* <Form.Label>{strings.coordinator[language]}</Form.Label>
              <Form.Group as={Col} controlId="coordinator_name">
                <div className="container">
                  <div className="pt-4  w-100">
                    <Button variant="outline-secondary" onClick={() => setShowCoordinatorModal(true)}>
                      {strings.add_coordinator[language]}
                    </Button>
                    <AddCoordinator onSuccess={() => {
                      getCoordinators().then(Coordinators => setCoordinators(Coordinators))
                    }} place_name={place_name} show={showCoordinatorModal} setShow={setShowCoordinatorModal} />
                  </div>
                </div>
              </Form.Group> */}
              <Form.Group as={Col} controlId="coordinator_name">
                <div className="container">
                  <div className="pt-4 w-100">
                    <Form.Label>{strings.coordinator[language]}</Form.Label>
                    {/* <ButtonToolbar aria-label="Toolbar with Button groups"> */}
                    <InputGroup>
                    <Button variant="outline-secondary" className='w-25' onClick={() => setShowCoordinatorModal(true)} style={{
                      zIndex: 0,
                    }}>
                      {strings.add_coordinator[language]}
                    </Button>
                    <AddCoordinator onSuccess={() => {
                      getCoordinators().then(Coordinators => setCoordinators(Coordinators))
                    }} place_name={place_name} show={showCoordinatorModal} setShow={setShowCoordinatorModal} />
                    <Select className='w-75' options={optionsCoordinators}
                      onChange={(e) => { 
                        
                        setChoosenCoordinators(e) }}
                      placeholder={strings.select_coordinator[language]}
                      isInvalid={invalid.choosenCoordinator}
                      required>
                      {/* <option value={strings.select[language]}>{strings.select[language]}</option> */}
                    </Select>
                    </InputGroup>
                    {/* </ButtonToolbar> */}
                  </div>
                </div>
              </Form.Group>
              {/* </Row> */}
              {/* choose coordinator */}
            </Row>

            <Row className="mb-3">
              {/* date */}
              <Form.Group as={Col} md="6" controlId="date">
                <Form.Label>{strings.date[language]}</Form.Label>
                <Form.Control
                  required
                  type="date"
                  placeholder={strings.date[language]}
                  onChange={(e) =>
                  setDate(e.target.value)}
                  isInvalid={invalid.date}
                />
              </Form.Group>
              {/* image */}
              <Form.Group as={Col} md="6" controlId="image">
                <Form.Label>{strings.image[language]}</Form.Label>
                <Form.Control type="file" placeholder={strings.choose_file[language]}
                  required
                  onChange={(e) => {
                    if (e.target.files[0].type === "image/png" || e.target.files[0].type === "image/jpeg") {
                      setInvalid({ ...invalid, image: false });
                    }
                    else {
                      setInvalid({ ...invalid, image: true });
                    }
                  }}
                  isInvalid={invalid.image}

                />
                <Form.Control.Feedback type="invalid">
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3">
            </Form.Group>
            <Button variant='outline-secondary' type="submit" disabled={submitted}>
              {submitted &&
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              }
              {strings.creat_shabat[language]}</Button>
          </Form>
        </Card.Body>
      </Card>

    </div>
  );
}