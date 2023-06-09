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
import { doc, setDoc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../common/FirebaseApp';
import { collection, getDocs } from "firebase/firestore";
import AddCoordinator from './AddCoordinator';
import Spinner from 'react-bootstrap/Spinner';
import {getCampers , getCoordinators} from '../common/Database';


// export async function getCampers() {
//   const CampersRef = collection(db, "campers");
//   const CampersSnapshot = await getDocs(CampersRef);
//   const Campers = CampersSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
//   return Campers;
// }

// export async function getCoordinators() {
//   const CoordinatorsRef = collection(db, "coordinators");
//   const CoordinatorsSnapshot = await getDocs(CoordinatorsRef);
//   const Coordinators = CoordinatorsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
//   return Coordinators;
// }


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

    setValidated(true);
    setSubmitted(true); // Set the submission status to true

    const imageFile = event.target.image.files[0]; // Get the image file from the input field
    const storageRef = ref(storage, "settlements/" + imageFile.name); // Create a storage reference with the desired file name
    await uploadBytes(storageRef, imageFile);// Upload the image file to Firestore storage
    const downloadURL = await getDownloadURL(storageRef);// Get the download URL of the uploaded image



    let city_he = place_name;
    if (language === "he") {
      setPlace_name(citys.values.filter(city => city.name === city_he).map(city => city.english_name)[0]) ;
    }
    const id = await createRegistration();
    //field campers have 3 fields: id, fameilies 

    const campersField = choosenCampers.map((camper, index) => ({
      id: camper.value.id,//here add id
      familie: "",
      assigning: false,
    }));

    console.log(id.id);
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
    navigate("/");
  };

  async function addShabat(shabatData) {
    const events = collection(db, 'events');
    await setDoc(doc(events), shabatData);
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
    <div className="App home-paragraph home-color text-dark pt-5">
      <Card className="text-center w-75 m-auto">
        <Card.Body>
          {submitted ? ( // Render the thank you message if the form is submitted
            <p>{strings.registration_submit_message[language]}</p>
          ) : (
            <p>{strings.creat_shabat[language]}</p>
          )}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* place */}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="place_name">
                <div className="container">
                  <div className="m-auto w-100">
                    <Form.Label>{strings.place_name[language]}</Form.Label>
                    <Select options={citysOptions}
                      onChange={(e) => { setPlace_name(e.value) }}
                      placeholder={strings.select[language]}
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
                    <Form.Label>{strings.campers[language]}</Form.Label>
                    {/* select first all the campers and than can delete the one you dont want */}
                    <Select
                      isMulti
                      onChange={(e) => setChoosenCampers(e)}
                      options={options}
                      placeholder={strings.select[language]}
                    />
                  </div>
                </div>
              </Form.Group>
            </Row>
              {/* choose coordinator */}
              <Row className="mb-3">
                <Form.Label>{strings.coordinator[language]}</Form.Label>
                {/* <Row className="mb-3"> */}
              <Form.Group as={Col} controlId="coordinator_name">
                <div className="container">
                  <div className="p-4 m-auto w-100">
                      <Button variant="outline-secondary" onClick={()=>setShowCoordinatorModal(true)}>
                        {strings.add_coordinator[language]}
                      </Button>
                    <AddCoordinator onSuccess={()=>{
                      getCoordinators().then(Coordinators => setCoordinators(Coordinators))
                    }} place_name={place_name} show={showCoordinatorModal} setShow={setShowCoordinatorModal}/>
                  </div>
                </div>
              </Form.Group>
              <Form.Group as={Col} md="9" controlId="coordinator_name">
                <div className="container">
                  <div className="p-4 m-auto w-100">
                    {/* <Form.Label>{strings.coordinator[language]}</Form.Label> */}
                    <Select options={optionsCoordinators}
                      onChange={(e) => { setChoosenCoordinators(e) }}
                      placeholder={strings.select[language]}>
                        {/* <option value={strings.select[language]}>{strings.select[language]}</option> */}
                      </Select>
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
                    setDate(e.target.value)
                  }
                />
              </Form.Group>
              {/* image */}
              <Form.Group as={Col} md="6" controlId="image">
                <Form.Label>{strings.image[language]}</Form.Label>
                <Form.Control type="file" placeholder={strings.choose_file[language]}
                  required
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