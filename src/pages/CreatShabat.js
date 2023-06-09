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
import { DataGrid } from '@mui/x-data-grid';


async function createAssigningDoc(settlement) {
  // Get a reference to the Firestore collection
  const collectionRef = collection(db, 'assignings');

  const data = {
    assignings: []
  };

  const docRef = doc(collectionRef, settlement);
  // Check if the document already exists
  const docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists()) {
    return;
  }
  await setDoc(doc(collectionRef, settlement), data);
}

function campersEscapeDate(campers){
  return campers.map((camper) => {
    if (camper.birth_date)
      camper.birth_date = new Date(camper.birth_date.seconds * 1000);
    return camper;
  });
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


  const campers_columns = [
    {headerName: strings.camper_id[language], field: 'camper_id', type: 'text'},
    {headerName: strings.first_name[language], field: 'first_name', type: 'text'},
    {headerName: strings.last_name[language], field: 'last_name', type: 'text'},
    {headerName: strings.birth_date[language], field: 'birth_date', type: 'date'},
    {headerName: strings.gender[language], field: 'gender', type: 'select', options: 
      {'male': strings.male[language], 'female': strings.female[language], 'other': strings.other[language] }
    },
    {headerName: strings.city[language],field: 'city',type: 'text'},
    {headerName: strings.address[language],field: 'address',type: 'text'},
    {headerName: strings.frame[language], field: 'frame', type: 'text' },
    { headerName: strings.disability_definition[language], field: 'disability_definition', type: 'text' },
    { headerName: strings.functioning_level[language], field: 'functioning_level', type: 'select',
      options: { 'high': strings.high[language], 'medium': strings.medium[language], 'low': strings.low[language] }
    },
    { headerName: strings.allergies[language], field: 'allergies', type: 'text' },
    { headerName: strings.parent_name[language], field: 'parent_name', type: 'text' },
    { headerName: strings.parent_phone[language], field: 'parent_phone', type: 'text' },
    { headerName: strings.branch[language], field: 'branch', type: 'text' },
    { headerName: strings.tutor[language], field: 'tutor', type: 'text' },
    { headerName: strings.tutor_phone[language], field: 'tutor_phone', type: 'text' },
    { headerName: strings.special_comment[language], field: 'comments', type: 'textarea' }
  ]
  useEffect(() => {
    getCampers().then(campersEscapeDate).then(Campers => setCampers(Campers))
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

  // const options = Campers.map((camper, index) => ({
  //   "value": camper, "label": camper.first_name
  // }));

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
      id: camper,//here add id
      family: "",
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
                    {/* add title */}
                    <h5 className='mb-3'>{strings.select_campers[language]}</h5>
                    <DataGrid 
                            rows={Campers}
                            columns={campers_columns}
                            initialState={{
                              pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                              },
                              columns: {
                                columnVisibilityModel: {
                                  // Hide columns status and traderName, the other columns will remain visible
                                  camper_id: false,
                                  city: false,
                                  address: false,
                                  disabilityDefinition: false,
                                  allergies: false,
                                  parentName: false,
                                  parentPhone: false,
                                  branch: false,
                                  tutor: false,
                                  tutorPhone: false,
                                  comments: false,

                                },
                              },                          
                            }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                setChoosenCampers(newRowSelectionModel);
                              }}
                              rowSelectionModel={choosenCampers}
                          />
                    {/* <Select
                      isMulti
                      onChange={(e) => setChoosenCampers(e)}
                      options={options}
                      placeholder={strings.select_campers[language]}
                      // isInvalid={invalid.choosenCampers}
                      // required
                    /> */}
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