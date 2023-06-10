import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import { db } from '../common/FirebaseApp';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { BiPencil } from 'react-icons/bi';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaChild } from 'react-icons/fa';
import Assigning from '../common/Assigning';
import strings from '../static/Strings.json';
import { Modal, Button, Form, Toast } from 'react-bootstrap';
import { FaSms } from 'react-icons/fa';
import { functions } from '../common/FirebaseApp';
import { httpsCallable } from "firebase/functions";
 
// Function to retrieve families data from Firestore
async function getFamilies(id, setFamiliesEvent, setFamiliesDoc, setEvent, setSettlement) {
  const events = collection(db, 'events');
  const cur_event = doc(events, id);
  setEvent(cur_event);
  const EventsSnapshot = await getDoc(cur_event);
  const eventData = EventsSnapshot.data();
  const families_id = eventData.registrationId;
  setSettlement(eventData.settlement)
  setFamiliesEvent(families_id);

  if (families_id) {
    const familiesRegCol = collection(db, 'familiesRegistration');
    const familiesReg = doc(familiesRegCol, families_id);
    setFamiliesDoc(familiesReg);
    const familySnapshot = await getDoc(familiesReg);
    if (familySnapshot.exists()) {
      const familyData = familySnapshot.data();
      return familyData.families;
    } else {
      console.log('Referenced family document does not exist.');
      return null;
    }
  } else {
    console.log('No reference to family document.');
    return null;
  }
}

export default function Families() {
  const { language } = React.useContext(LanguageContext);
  const [families, setFamilies] = useState([]);
  const [event, setEvent] = useState(null);
  const location = useLocation();
  const [pathSuffix, setPathSuffix] = useState('');
  const [familiesEvent, setFamiliesEvent] = useState(null);
  const [familiesDoc, setFamiliesDoc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const navigate = useNavigate();
 
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showSMSModal, setShowSMSModal] = useState(false);
 
  // Extract the suffix from the current URL path
  useEffect(() => {
    const path = location.pathname;
    const parts = path.split('/');
    const suffix = parts[parts.length - 1];
    setPathSuffix(suffix);
  }, [location]);

// Fetch families data based on the extracted suffix
useEffect(() => {
  const fetchData = async () => {
    if (pathSuffix) { // Check if pathSuffix is not empty or null
      const familiesData = await getFamilies(
        pathSuffix, setFamiliesEvent, setFamiliesDoc, setEvent, setSettlement);
      if (familiesData) {
        setFamilies(familiesData);
      }
    }
  };

  fetchData().catch(error => console.log(error));
}, [pathSuffix]);


  const editClick = async (family) => {
    setSelectedFamily(family);
    navigate(`./${familiesEvent}`, { state: { familiesId: familiesEvent, selectedFamily: family, event_id: pathSuffix } });
  };

  const confirm = async (index, bool) => {
    const updatedFamilies = [...families];
    const familyToUpdate = { ...updatedFamilies[index] };
    const isAssigned = familyToUpdate.assigning;
    familyToUpdate.confirmed = bool;
    familyToUpdate.assigning = false;
    const lastCamper = familyToUpdate.camper;
    familyToUpdate.camper = null;
    updatedFamilies[index] = familyToUpdate;
    // Update specific fields in familiesDoc
    await updateDoc(familiesDoc, {
      families: updatedFamilies.map((family) => ({
        ...family,
        confirmed: family.id === familyToUpdate.id ? bool : family.confirmed,
        assigning: family.id === familyToUpdate.id ? false : family.assigning,
        camper: family.id === familyToUpdate.id ? null : family.camper,
      })),
    });
  
    setFamilies(updatedFamilies);
  
    const eventsSnapshot = await getDoc(event);
    const eventData = eventsSnapshot.data();
    const confirmedFamilies = eventData.families;
    const campers = [...eventData.campers];
    if (bool) {
      const updatedConfirmedFamilies = [...confirmedFamilies, familyToUpdate.id];
      await updateDoc(event, { families: updatedConfirmedFamilies });
    } else {
      if (isAssigned) {
        const updatedCampers = campers.map((camper) => {
          if (camper.id === lastCamper) {
            return { ...camper, assigning: false, family: null };
          }
          return camper;
        });
        await updateDoc(event, {
          families: confirmedFamilies.filter((family) => family !== familyToUpdate.id),
          campers: updatedCampers,
        });
      } else {
        await updateDoc(event, {
          families: confirmedFamilies.filter((family) => family !== familyToUpdate.id),
        });
      }
    }
  };
 
  const closeModal = () => {
    setShowSMSModal(false);
  };
 
  const handleAssigningModal = (family) => {
    setSelectedFamily(family);
    setShowSMSModal(true);
  };
 
  const handleSendShabbatMessage = () => {
    console.log('Sending Shabbat details to selected campers');
 
    // Logic to send "hi you are invited to a Shabbat at 15/5/2025"
    // Show success toast
    const sendSMS = httpsCallable(functions, 'sendMessagesWithTemplate');
    const template = "hi [#name#], you've been asigned with [#camper#] camper, please contact him/her to arrange the meeting. [#coordinator#] coordinator";
    const Recipients = [
      { name: selectedFamily.first_name, Phone: selectedFamily, camper: "Yonatan", coordinator: "Dave" },
    ];
    sendSMS({
      template: template,
      recipients: Recipients
    }).then((result) => {
      console.log(result);
    })
 
    setShowSuccessToast(true);
    closeModal();
  };
 
  const handleSendCustomMessage = () => {
    console.log('Sending custom message to selected campers:', customMessage);
    // Logic to send the custom message
    closeModal();
  };


  return (
    <Container fluid>
      <h1>{strings.registered_families[language]}</h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">{strings.first_name[language]}</TableCell>
              <TableCell align="right">{strings.last_name[language]}</TableCell>
              <TableCell align="right">{strings.city[language]}</TableCell>
              <TableCell align="right">{strings.street[language]}</TableCell>
              <TableCell align="right">{strings.house_number[language]}</TableCell>
              <TableCell align="right">{strings.apartment_number[language]}</TableCell>
              <TableCell align="right">{strings.phone_number[language]}</TableCell>
              <TableCell align="right">{strings.email[language]}</TableCell>
              <TableCell align="right">{strings.special_comment[language]}</TableCell>
              <TableCell align="right">{strings.confirmed[language]}</TableCell>
              <TableCell align="right">{strings.editFamily[language]}</TableCell>
              <TableCell align="right">{strings.assigning[language]}</TableCell>
              <TableCell align="right">{strings.sendSMS[language]}</TableCell>
              <TableCell align="right">{strings.curAssigning[language]}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {families.map((family, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="right">{family.first_name}</TableCell>
                <TableCell align="right">{family.last_name}</TableCell>
                <TableCell align="right">{family.city}</TableCell>
                <TableCell align="right">{family.street}</TableCell>
                <TableCell align="right">{family.house_number}</TableCell>
                <TableCell align="right">{family.apartment_number}</TableCell>
                <TableCell align="right">{family.phone_number}</TableCell>
                <TableCell align="right">{family.email}</TableCell>
                <TableCell align="right">{family.special_comment}</TableCell>
                <TableCell align="right">
                  <BsCheckCircleFill
                    style={{ cursor: 'pointer' }}
                    size={30}
                    color={family.confirmed ? 'green' : 'grey'}
                    onClick={() => confirm(index, !family.confirmed)}
                  />
                </TableCell>
                <TableCell align="right">
                  <BiPencil
                    size={24}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      editClick(family);
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  {family.confirmed && (
                    <FaChild
                      size={24}
                      color="#313B72"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleAssigningModal(family)}
                    />
                  )}
                  <Assigning show={showModal} onHide={() => setShowModal(false)} language={language} event={event} selectedFamily={selectedFamily} setFamilies={setFamilies} settlement={settlement} />
                </TableCell>
                <TableCell align="right">
 
                  <FaSms
                    size={24}
                    color="#313B72"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setShowSMSModal(true);
                      setSelectedFamily(family);
                    }}
                  />
                  <Modal show={showSMSModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Send SMS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Group>
                        <Form.Label>Choose an option:</Form.Label>
                        <Form.Select
                          value={selectedOption}
                          onChange={(e) => setSelectedOption(e.target.value)}
                        >
                          <option value="">Select an option</option>
                          <option value="shabbat">Send Shabbat details</option>
                          <option value="custom">Free text</option>
                        </Form.Select>
                      </Form.Group>
                      {selectedOption === 'custom' && (
                        <Form.Group>
                          <Form.Label>Enter your custom message:</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                          />
                        </Form.Group>
                      )}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={closeModal}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={
                          selectedOption === 'shabbat'
                            ? handleSendShabbatMessage
                            : handleSendCustomMessage
                        }
                        disabled={!selectedOption}
                      >
                        Send
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Toast
                    show={showSuccessToast}
                    onClose={() => setShowSuccessToast(false)}
                    delay={3000}
                    autohide
                    style={{
                      position: 'fixed',
                      bottom: '10px',
                      right: '10px',
                    }}
                  >
                    <Toast.Header>
                      <strong className="me-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body>Shabbat details sent successfully!</Toast.Body>
                  </Toast>
                </TableCell>
 
                <TableCell align="right">{family.camper}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

