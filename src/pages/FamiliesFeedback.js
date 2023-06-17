//forms card feedback from families

import React, { useState, useContext } from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import strings from '../static/Strings.json';
// import { getEvents } from '../common/Database';
// import { useParams } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../common/FirebaseApp';
import { collection } from "firebase/firestore";
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useParams } from "react-router-dom";
import { FormHelperText } from '@mui/material';
// import { httpsCallable } from '@firebase/functions';
// import { functions } from '../common/FirebaseApp';
import {getCamperByFamilyAndEvent} from '../common/Database';
 
// async function sendFeedbackSms(){
//     const doThings = httpsCallable(functions, 'sendFeedbackRequest');
//     const result = await doThings({});
//     return result
// }

export default function FamiliesFeedback() {
    const { language } = useContext(LanguageContext);
    // const [Events, setEvents] = useState([]);
    // const [Feedbacks, setFeedbacks] = useState([]);
    // const [feedback, setFeedback] = useState("");
    const [submitted, setSubmitted] = useState(false); // Track form submission status
    // const [invalid, setInvalid] = useState({
    //     feedback: false,
    // });
    const [value, setValue] = useState(0);
    const [hover, setHover] = useState(-1);
    const [feedback_same_camper, setFeedback_same_camper] = useState("");
    const [feedback_expierence, setFeedback_expierence] = useState("");
    const [feedback_other_comments, setFeedback_other_comments] = useState("");
    const { eventId, familyId } = useParams();
    const [radioErrorText, setRadioErrorText] = useState('');
    const [ratingErrorText, setRatingErrorText] = useState('');
    

    const labels = {
        0.5: strings.poor[language],
        1: strings.poor_plus[language],
        1.5: strings.ok[language],
        2: strings.ok_plus[language],
        2.5: strings.good[language],
        3: strings.good_plus[language],
        3.5: strings.excellent[language],
        4: strings.excellent_plus[language],
        4.5: strings.perfect[language],
        5: strings.perfect_plus[language],
    };

    function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }


    // const [validated, setValidated] = useState(false);
    // const [show, setShow] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (feedback_same_camper === "") {
            setRadioErrorText(strings.feedback_same_camper_error[language]);
            return;
        }

        if (value === 0) {
            setRatingErrorText(strings.feedback_rate_shabat_error[language]);
            return;
        }
        // validate all fields
        ///:id/:family
        let camper = await getCamperByFamilyAndEvent(familyId, eventId);
        console.log("familyId", camper);
        const newFeedback = {
            family: familyId,
            event: eventId,
            camper: camper,
            feedback_same_camper: feedback_same_camper,
            feedback_rate_shabat: value,
            feedback_expierence: feedback_expierence,
            feedback_other_comments: feedback_other_comments,
        };
        // const newFeedbacks = [...Feedbacks, newFeedback];
        // console.log("newFeedback", newFeedback);
        // setFeedbacks(newFeedback);

        await updateFeedback(newFeedback);
        setSubmitted(true);
        // setFeedback("");
        // setValidated(true);
        // navigate("/FamiliesFeedback");
    };

    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;
    //     setFeedback(value);
    //     setInvalid({ ...invalid, [name]: false });
    //     console.log("feedback", feedback);


    // };

    // useEffect(() => {
    //     getEvents().then(Events => setEvents(Events));
    // }, []);

    async function updateFeedback(newFeedbacks) {
        //add a doc to the familiesFeedback
        const feedbackRef = collection(db, "familiesFeedback");
        const docId = familyId + eventId;
        await setDoc(doc(feedbackRef, docId), newFeedbacks);
    }







    return (
        <>
            <Card className="text-center w-75 m-auto mt-5">
                <Card.Header>{strings.feedback[language]}</Card.Header>
                <Card.Body>
                    {submitted ? ( // Render the thank you message if the form is submitted and dont render the form
                        <Card.Title>{strings.thank_you[language]}</Card.Title>


                    ) : (
                        <>
                            <Card.Title className='mb-3'>{strings.feedback_explanation[language]}</Card.Title>
                            <Form onSubmit={handleSubmit} className='needs-validation'>
                                <div className="form-group">
                                    {/* <label>{strings.feedback_camper_expierence[language]}</label> */}
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="feedback1"
                                        value={feedback_expierence}
                                        onChange={(event) => setFeedback_expierence(event.target.value)}
                                        // isInvalid={invalid.feedback}
                                        placeholder={strings.feedback_camper_expierence[language]}
                                    ></textarea>
                                </div>
                                <Row>
                                    <Col>
                                        <FormControl error={radioErrorText?true:false} className='mt-3'>
                                            <Form.Label>{strings.feedback_same_camper[language]}</Form.Label>
                                            <FormHelperText>{radioErrorText}</FormHelperText>
                                            <RadioGroup

                                                required aria-label="feedback_same_camper"
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                name="radio-buttons-group"
                                                value={feedback_same_camper}
                                                onChange={(event) => {
                                                    setFeedback_same_camper(event.target.value);
                                                    setRadioErrorText('');
                                                }}
                                            >
                                                <FormControlLabel value={true} control={<Radio />} label={strings.yes[language]} />
                                                <FormControlLabel value={false} control={<Radio />} label={strings.no[language]} />
                                            </RadioGroup>

                                        </FormControl>
                                    </Col>
                                    <Col>
                                        {/* rate_shabat */}
                                        <FormControl  error={ratingErrorText?true:false} className="mt-3">
                                            <Form.Label>{strings.rate_shabat[language]}</Form.Label>
                                            <FormHelperText>{ratingErrorText}</FormHelperText>

                                            <Rating size="large"
                                                name="size-large"
                                                value={value}
                                                required
                                                precision={0.5}
                                                getLabelText={getLabelText}
                                                onChange={(event, newValue) => {
                                                    setValue(newValue);
                                                    setRatingErrorText('');
                                                    console.log("newValue", newValue);
                                                }}
                                                onChangeActive={(event, newHover) => {
                                                    setHover(newHover);
                                                    console.log("newHover", newHover);
                                                }}
                                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                            />
                                            {value !== null && (
                                                <Box className='mb-3' sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
                                            )}
                                            {/* eedback_other_comments */}
                                        </FormControl>
                                    </Col>
                                </Row>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="feedback_other_comments"
                                    value={feedback_other_comments}
                                    onChange={(event) => setFeedback_other_comments(event.target.value)}
                                    // isinvalid={invalid.feedback_other_comments}
                                    placeholder={strings.feedback_other_comments[language]}
                                ></textarea>
                                <Form.Group className="mb-3">
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    {strings.send[language]}
                                </Button>
                            </Form>

                        </>

                    )}

                </Card.Body>
            </Card>
        </>
    )
}


