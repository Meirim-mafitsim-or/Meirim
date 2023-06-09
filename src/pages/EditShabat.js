import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';
import Select from 'react-select';
import citys from '../static/city.json';
import { doc, setDoc, } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../common/FirebaseApp';
import { collection } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import ManagableTable from '../common/ManagebleTable';
import TableModal from '../common/TableModal';
import AddIcon from '@mui/icons-material/Add';
import { deleteDoc } from "firebase/firestore";
import Spinner from 'react-bootstrap/Spinner';
import { getEventById,getCoordinators,getCampers,getCampersById } from '../common/Database';


// export async function getEventById(eventId) {
//     const EventsRef = collection(db, "events");
//     const EventsSnapshot = await getDocs(EventsRef);
//     const Events = EventsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
//     const event = Events.filter(event => event.id === eventId);
//     return event;
// }

// export async function getCoordinators() {
//     const CoordinatorsRef = collection(db, "coordinators");
//     const CoordinatorsSnapshot = await getDocs(CoordinatorsRef);
//     const Coordinators = CoordinatorsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
//     return Coordinators;
// }

// export async function getCampers() {
//     const CampersRef = collection(db, "campers");
//     const CampersSnapshot = await getDocs(CampersRef);
//     const Campers = CampersSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
//     return Campers;
// }

function formatDate(seconds) {
    const date = new Date(seconds * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getCityName(settlement, language) {
    if (language === "he") {
        return citys.values.filter(city => city.english_name === settlement).map(city => city.name)[0];
    }
    else {
        return settlement;
    }
}

const ShabatDitails_columns = ['coordinator', 'date', 'image', 'settlement'];

export default function FormEvent() {
    let { id } = useParams();
    const [validated, setValidated] = useState(false);
    const [submitted, setSubmitted] = useState(false); // Track form submission status
    const { language } = React.useContext(LanguageContext);
    const navigate = useNavigate();
    const [shabatDitails, setShabatDitails] = useState(ShabatDitails_columns.reduce((obj, key) => ({ ...obj, [key]: '' }), {}));
    const [Coordinators, setCoordinators] = useState([]);
    const [families, setFamilies] = useState([]);
    const [campers, setCampers] = useState([]);
    const [allCampers, setAllCampers] = useState([]);
    const [imageChanged, setImageChanged] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [restCampers, setRestCampers] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [campersData, setCampersData] = useState([]);

    const campers_columns = [
        {
            title: strings.first_name[language],
            field: 'firstName',
            type: 'text'
        },
        {
            title: strings.last_name[language],
            field: 'lastName',
            type: 'text'
        },
        {
            title: strings.age[language],
            field: 'age',
            type: 'number'
        },
        {
            title: strings.disability_rank[language],
            field: 'disabilityRank',
            type: 'number'
        },
        {
            title: strings.gender[language],
            field: 'gender',
            type: 'select',
            options: {
                'male': strings.male[language],
                'female': strings.female[language],
                'other': strings.other[language]
            }
        },
        {
            title: strings.special_comment[language],
            field: 'comments',
            type: 'textarea'
        }
    ]
    const families_columns = [
        {
            title: strings.first_name[language],
            field: 'first_name',
            type: 'text'
        },
        {
            title: strings.last_name[language],
            field: 'last_name',
            type: 'text'
        },
        {
            title: strings.city[language],
            field: 'city',
            type: 'text'
        },
        {
            title: strings.street[language],
            field: 'street',
            type: 'text'
        },
        {
            title: strings.house_number[language],
            field: 'house_number',
            type: 'number'
        },
        {
            title: strings.apartment_number[language],
            field: 'apartment_number',
            type: 'number'
        },
        {
            title: strings.phone_number[language],
            field: 'phone_number',
            type: 'text'
        },
        {
            title: strings.email[language],
            field: 'email',
            type: 'text'
        },
        {
            title: strings.special_comment[language],
            field: 'special_comment',
            type: 'textarea'
        }
    ]

    const tableActions = [
        {
            icon: <AddIcon />,
            title: strings.add_camper[language],
            onClick: (selected) => {
                // show modal
                setShowModal(true);
            }
        }
    ]


    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const event = await getEventById(id);

                setShabatDitails({
                    coordinator: event[0].coordinator,
                    date: event[0].date,
                    image: event[0].image,
                    settlement: event[0].settlement,
                });
                const camperss = await getCampersById(event[0].campers.map((camper) => camper.id));
                setCampers(camperss);
                setCampersData(event[0].campers);

                setFamilies(event[0].families);
                getCampers().then(Campers => setAllCampers(Campers));
        
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        };
        fetchEventData();
        getCoordinators().then(Coordinators => setCoordinators(Coordinators));
    }, [ id]);//here add to do marging



    // then(Campers => Campers.filter(camper => !(campersId.includes(camper.id)))).then(camp => setRestCampers(camp)).then(() => console.log(restCampers));
    // setRestCampers(allCampers.filter(camper => !(campers.map((c)=>c.id).includes(camper.id))));
    useEffect(() => {
        setRestCampers(allCampers.filter(camper => !(campers.map((c) => c.id).includes(camper.id))));
    }, [allCampers, campers]);

    const handleAddCamper = (camper) => {
        setCampers([...campers, camper]);
    }

    const handleDeleteCamper = (camperId) => {

        for (let i = 0; i < campers.length; i++) {
            if (campers[i].id === camperId) {
                campers.splice(i, 1);
                break;
            }
        }
        setCampers(campers);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
        setSubmitted(true); // Set the submission status to true
        //if the user dont change the image the image will be the same and start with https://firebasestorage
        let downloadURL = shabatDitails.image;
        if (imageChanged) {
            const imageFile = event.target.image.files[0]; // Get the image file from the input field
            const storageRef = ref(storage, "settlements/" + imageFile.name); // Create a storage reference with the desired file name
            await uploadBytes(storageRef, imageFile);// Upload the image file to Firestore storage
            downloadURL = await getDownloadURL(storageRef);// Get the download URL of the uploaded image
        }



        let city_en;
        if (language === "he") {
            city_en = citys.values.filter(city => city.name === shabatDitails.settlement).map(city => city.english_name)[0];
            setShabatDitails({
                ...shabatDitails,
                settlement: city_en,
            });
        }

        const listCampers = campers.map((camper) => {
            if(camper.id in campersData.map((c)=>c.id)){
                return campersData.find((c)=>c.id === camper.id);
            }
            else{
                return{
                    id: camper.id,
                    familie :"",
                    assigning: false,
                }
            }
        });

        const shabatData = {
            coordinator: shabatDitails.coordinator,
            date: shabatDitails.date,
            image: downloadURL,
            settlement: shabatDitails.settlement,
            campers: listCampers,
            families: families,
        };

        await apdateShabat(shabatData);
        navigate("/");
    };

    const handleDeleteEvent = async (event) => {
        event.preventDefault();
        setSubmitted(true); // Set the submission status to true
        const eventsRef = collection(db, "events");
        await deleteDoc(doc(eventsRef, id));
        navigate("/");
    };


    async function apdateShabat(shabatData) {
        const eventsRef = collection(db, "events");
        await setDoc(doc(eventsRef, id), shabatData, { merge: true });
    }

    const citysOptions = citys.values.map((city, index) => {
        if (language === "he") {
            return { "value": city.english_name, "label": city.name }
        }
        else {
            return { "value": city.english_name, "label": city.english_name }
        }
    });
    const optionsCoordinators = Coordinators.map((coordinator, index) => ({
        "value": coordinator, "label": coordinator.first_name + " " + coordinator.last_name + " - " + coordinator.place_name
    }));


    return (
        <div className="App home-paragraph home-color text-dark pt-5">
            <Card className="text-center w-75 m-auto">
                <Card.Body>
                    {submitted ? ( // Render the thank you message if the form is submitted
                        <p>{strings.registration_submit_message[language]}</p>
                    ) : (
                        <p>{strings.edit_shabat[language]}</p>
                    )}
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md="6">
                                <Row className="mb-8 mt-2">
                                    <Form.Group as={Col} controlId="first_name">
                                        <Select
                                            options={citysOptions}
                                            required
                                            placeholder={getCityName(shabatDitails.settlement, language)}
                                            value={shabatDitails.settlement}
                                            onChange={(selectedOption) =>

                                                setShabatDitails({
                                                    ...shabatDitails,
                                                    settlement: selectedOption.value,
                                                })
                                            }
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-7 mt-5">
                                    <Form.Group as={Col} controlId="coordinator" className="mt-5">
                                        <Select
                                            options={optionsCoordinators}
                                            required
                                            placeholder={shabatDitails.coordinator.first_name + " " + shabatDitails.coordinator.last_name + " - " + shabatDitails.coordinator.place_name}
                                            value={optionsCoordinators.find(option => option.value === shabatDitails.coordinator)}
                                            onChange={(selectedOption) =>
                                                setShabatDitails({
                                                    ...shabatDitails,
                                                    coordinator: selectedOption.value,
                                                })
                                            }

                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-2 mt-5" >
                                    {/* //change the date*/}
                                    <Form.Group as={Col} controlId="date" className="mt-5">
                                        <Form.Control

                                            type="date"
                                            placeholder={shabatDitails.date.seconds}
                                            value={shabatDitails.date ? formatDate(shabatDitails.date.seconds) : ''}
                                            onChange={(e) =>
                                                setShabatDitails({
                                                    ...shabatDitails,
                                                    date: {
                                                        seconds: Math.floor(new Date(e.target.value).getTime() / 1000),
                                                    },
                                                })
                                            }
                                        />
                                    </Form.Group>
                                </Row>
                            </Col>
                            <Col md="6" mr="8">

                                <Form.Group as={Col} controlId="image">
                                    {/* <Form.Label>{strings.image[language]}</Form.Label> */}
                                    <img src={imageChanged ? previewImage : shabatDitails.image} className="mt-2 mb-4 rounded w-100 h-70" alt="shabat" height="250" />
                                    <Form.Control className="w-65"
                                        type="file"
                                        placeholder={shabatDitails.image}
                                        // onChange={(e) => setShabatDitails({ ...shabatDitails, image: e.target.files[0] })}
                                        onChange={(e) => {
                                            setImageChanged(true);
                                            setShabatDitails({
                                                ...shabatDitails,
                                                image: e.target.value,
                                            })
                                            setPreviewImage(URL.createObjectURL(e.target.files[0]));
                                        }}
                                    />
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row className="mb-3">
                            <Accordion>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>{strings.families[language]}</Accordion.Header>
                                    <Accordion.Body>
                                        <Row className="mb-3">
                                            <ManagableTable columns={families_columns} data={families} selectable={false} />
                                            <Button className="mt-2" variant="outline-secondary" onClick={() => navigate(`/Families/${id}`)}>{strings.edit_family_and_match[language]}</Button>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Row>
                        <Row className="mb-3">
                            <Accordion>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>{strings.campers[language]}</Accordion.Header>
                                    <Accordion.Body>
                                        <Row className="mb-3">
                                            <ManagableTable
                                                columns={campers_columns}
                                                data={campers}
                                                onDelete={handleDeleteCamper}
                                                globalActions={tableActions} />
                                            <TableModal
                                                onAdd={handleAddCamper}
                                                campers={restCampers}
                                                show={showModal}
                                                setShow={setShowModal} />
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Row>
                        <Row className="mb-3">

                        </Row>
                        <Form.Group className="mb-3">
                        </Form.Group>
                        <Button variant='outline-secondary' type="submit" className='m-2' disabled={submitted}>
                            {submitted &&
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            }
                            {strings.edit[language]}</Button>
                        <Button variant='outline-secondary' onClick={handleDeleteEvent} disabled={submitted}>
                            {submitted &&
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            }
                            {strings.delete_shabat[language]}</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}








