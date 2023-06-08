import React from 'react';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import { db } from '../common/FirebaseApp';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import strings from '../static/Strings.json';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { BiPencil } from 'react-icons/bi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsCheckCircleFill } from 'react-icons/bs';
import { isEqual } from 'lodash';
import { FaChild } from 'react-icons/fa';
import Assigning from '../common/Assigning';
import { useNavigate } from 'react-router-dom';

// Function to retrieve families data from Firestore
export async function getFamilies(id, setFamiliesEvent, setFamiliesDoc, setEvent) {
  const events = collection(db, 'events');
  const cur_event = doc(events, id);
  setEvent(cur_event);
  const EventsSnapshot = await getDoc(cur_event);
  const eventData = EventsSnapshot.data();
  const families_id = eventData.registrationId;
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
  const [selectedFamily, setSelectedFamily] = useState(null); // State for selected family
  const navigate = useNavigate();

  // Extract the suffix from the current URL path
  useEffect(() => {
    const path = location.pathname;
    const parts = path.split('/');
    const suffix = parts[parts.length - 1];
    setPathSuffix(suffix);
  }, [location]);

  // Fetch families data based on the extracted suffix
  useEffect(() => {
    if (pathSuffix) {
      getFamilies(pathSuffix, setFamiliesEvent, setFamiliesDoc, setEvent)
        .then((families) => setFamilies(families))
        .catch((error) => console.log(error));
    }
  }, [pathSuffix]);

  const editClick = async (family) => {
    setSelectedFamily(family); // Update the selected family
    navigate(`./${familiesEvent}`, { state: { familiesId: familiesEvent, selectedFamily: family, event_id: pathSuffix } });
  };

  // Confirm a family's registration
  const confirm = async (index, bool) => {
    const updatedFamilies = [...families];
    const familyToUpdate = { ...updatedFamilies[index] }; // Clone the family object
    familyToUpdate.confirmed = bool;
    updatedFamilies[index] = familyToUpdate;
    setFamilies(updatedFamilies);

    const desiredFamily = families[index];
    console.log(desiredFamily, index);
    if (desiredFamily) {
      desiredFamily.confirmed = bool;
      // Update the family object in the Firebase Firestore database
      await updateDoc(familiesDoc, { families });
    } else {
      console.log('Family not found');
    }

    const EventsSnapshot = await getDoc(event);
    const eventData = EventsSnapshot.data();
    const confirmedFamilies = eventData.families;

    if (bool) {
      const updatedConfirmedFamilies = [...confirmedFamilies, desiredFamily.id];
      await updateDoc(event, { families: updatedConfirmedFamilies });
    } else {
      const updatedConfirmedFamilies = confirmedFamilies.filter((id) => id !== desiredFamily.id);
      await updateDoc(event, { families: updatedConfirmedFamilies });
    }
  };

  const handleAssigningModal = (family) => {
    setSelectedFamily(family);
    setShowModal(true);
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
              <TableCell align="right">{strings.edit[language]}</TableCell>
              <TableCell align="right">{strings.assigning[language]}</TableCell>
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
                    onClick={() => confirm(index, !family.confirmed)} // Pass the index and inverse of `family.confirmed`
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
                  <Assigning show={showModal} onHide={() => setShowModal(false)} language={language} event={event} selectedFamily={selectedFamily} />
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
