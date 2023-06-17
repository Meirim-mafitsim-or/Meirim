
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import strings from '../static/Strings.json';
import { BiUserPlus } from 'react-icons/bi';
import { db } from '../common/FirebaseApp';
import { updateDoc } from 'firebase/firestore';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { BiCheck } from 'react-icons/bi';

export async function getCampers(event, setRegID) {
  const EventsSnapshot = await getDoc(event);
  const eventData = EventsSnapshot.data();
  setRegID(eventData.registrationId);
  const campersID  = eventData.campers;
  const campersSnapshot = await getDocs(collection(db, 'campers'));

  const campersData = [];
  
  campersSnapshot.forEach((camperDoc) => {
    const camperData = camperDoc.data();
    const camperId = camperDoc.id;
    const camperDataWithId = { ...camperData, id: camperId };
    campersData.push(camperDataWithId);
  });

  const joinedCampers = campersID.map((camperID) => {
    const foundCamper = campersData.find((camper) => camper.id === camperID.id);
    return {
      ...camperID,
      ...foundCamper
    };
  });
  return joinedCampers;

}

export default function Assigning({
  show,
  onHide,
  language,
  event,
  selectedFamily,
  setFamilies,
  settlement,
}) {
  const [campers, setCampers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('age');
  const [filterByGender, setFilterByGender] = useState('');
  const [regID, setRegID] = useState(null);
  const [historyAss, setHistoryAss] = useState([]);
  const [showFilteredCampers, setShowFilteredCampers] = useState(false);

  useEffect(() => {
    const fetchCampers = async () => {
      try {
        const fetchedCampers = await getCampers(event, setRegID);
        setCampers(fetchedCampers);
        if (show && selectedFamily) {
          await checkCamperIDInAssigningsArray(
            selectedFamily.last_name,
            selectedFamily.phone_number
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCampers(); // Call the fetchCampers function

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, selectedFamily]); // Include selectedFamily as a dependency

  // Filter campers based on search query and gender filter
  const filteredCampers = campers.filter(
    (camper) =>
      (camper.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camper.last_name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!filterByGender || camper.gender === filterByGender) &&
      (!showFilteredCampers || historyAss.includes(camper.id))
  );

  // Sort campers based on the selected sorting option
  const sortedCampers = filteredCampers.sort((a, b) => {
    if (sortBy === 'age') {
      return a.age - b.age;
    }
    return 0;
  });

  // Fetch the assignings document for the selected settlement
  const getFamilyFromAssignings = async (settlement) => {
    if (!selectedFamily) {
      console.log('No selected family.');
      return null;
    }

    const collectionRef = collection(db, 'assignings');
    const docRef = doc(collectionRef, settlement);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      console.log('Assigning document not found.');
      return null;
    }

    const assigningsData = docSnapshot.data();
    const assigningsArray = assigningsData.assignings || []; // Initialize with an empty array

    let assigningExists = null;

    assigningsArray.some((assigning) => {
      if (
        assigning.familyName === selectedFamily.last_name &&
        assigning.phoneNumber === selectedFamily.phone_number
      ) {
        // Object matching the conditions found in the array
        assigningExists = assigning;
        return true; // Exit the loop
      }
      return false;
    });

    return { assigningExists, assigningsArray };
  };



  // Check if the camper ID exists in the assignings array for the selected family
  const checkCamperIDInAssigningsArray = async (last_name, phone_number) => {
    const result = await getFamilyFromAssignings(settlement);
    if (result !== null) {
      // eslint-disable-next-line no-unused-vars
      const { assigningExists: ignored, assigningsArray } = await getFamilyFromAssignings(settlement);
      
      if (!assigningsArray || assigningsArray.length === 0) {
        return;
      }
      const foundAssigning = assigningsArray.find(
        (assigning) => assigning.family_name === last_name && assigning.phone_number === phone_number
      );

      if (foundAssigning) {
        const idArray = foundAssigning.campersID.map(item => item.id);
        setHistoryAss(idArray);
        return idArray;
      }
    } else 
    {
      return [];
    }
    

    return [];
  };

  // Handle click event when the user clicks the "User Plus" icon to assign a camper to a family
  const handleUserPlusClick = async (camperID) => {
    const curCamper = campers.find((camper) => camper.id === camperID);
    const updatedCampers = [...campers];
    const familiesCol = collection(db, 'familiesRegistration');
    const cur_families = doc(familiesCol, regID);

    const FamiliesSnapshot = await getDoc(cur_families);
    const familiesData = FamiliesSnapshot.data();

    const families = familiesData.families;

    if (curCamper.assigning) {
      const confirmed = window.confirm(strings.to_change_assigning[language]);
      if (!confirmed) {
        return; // Don't proceed further if not confirmed
      }
      const lastFamily = families.find((check_family) => check_family.id === curCamper.family);
      if (lastFamily) {
        lastFamily.assigning = false;
        lastFamily.camper = null;
      }
    }
    if (selectedFamily.assigning) {
      const lastCamper = campers.find((camper) => camper.id === selectedFamily.camper);
      if (lastCamper) {
        lastCamper.assigning = false;
        lastCamper.family = null;
      }
    }

    curCamper.assigning = true;
    curCamper.family = selectedFamily.id;

    const desiredFamilyIndex = families.findIndex((check_family) => check_family.id === selectedFamily.id);
    if (desiredFamilyIndex !== -1) {
      families[desiredFamilyIndex].camper = curCamper.id;
      families[desiredFamilyIndex].assigning = true;
    }

    // Update the family object in the Firebase Firestore database
    await Promise.all([
      updateDoc(event, { campers: updatedCampers }),
      setDoc(cur_families, { families }),
    ]);
    onHide();
    setFamilies(families);
  };

  return (
    <Modal show={show} onHide={onHide} centered className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>{strings.assigning[language]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between mb-3">
          <div>
            <label htmlFor="searchInput" className="form-label">
              {strings.search_by_name[language]}
            </label>
            <input
              type="text"
              className="form-control"
              id="searchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-start">
            <div className="me-3">
              <label htmlFor="sortSelect" className="form-label">
                {strings.sort_by_age[language]}
              </label>
              <select
                className="form-select"
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="age">{strings.ascending[language]}</option>
                <option value="-age">{strings.descending[language]}</option>
              </select>
            </div>
            <div className="me-3">
              <label htmlFor="filterSelect" className="form-label">
                {strings.filter_by_gender[language]}
              </label>
              <select
                className="form-select"
                id="filterSelect"
                value={filterByGender}
                onChange={(e) => setFilterByGender(e.target.value)}
              >
                <option value="">{strings.all[language]}</option>
                <option value="male">{strings.male[language]}</option>
                <option value="female">{strings.female[language]}</option>
              </select>
            </div>
          </div>
        </div>
        <div className="form-check mb-1">
          <input
            className="form-check-input"
            type="checkbox"
            id="filterCheckbox"
            checked={showFilteredCampers}
            onChange={(e) => {setShowFilteredCampers(e.target.checked); }}
          />
          <label className="form-check-label" htmlFor="filterCheckbox">
            {strings.show_only_campers_in_history[language]}
          </label>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>{strings.id[language]}</th>
              <th>{strings.first_name[language]}</th>
              <th>{strings.last_name[language]}</th>
              <th>{strings.gender[language]}</th>
              <th>{strings.age[language]}</th>
              <th>{strings.allergies[language]}</th>
              <th>{strings.disability_definition[language]}</th>
              <th>{strings.functioning_level[language]}</th>
              <th>{strings.special_comment[language]}</th>
              <th>{strings.assigned[language]}</th>
              <th>{strings.choose[language]}</th>
            </tr>
          </thead>
          <tbody>
            {sortedCampers.map((item, index) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.gender}</td>
                <td>{item.age}</td>
                <td>{item.allergies}</td>
                <td>{item.disability_definition}</td>
                <td>{item.functioning_level}</td>
                <td>{item.comments}</td>
                <td>{item.assigning ? <BiCheck size={20} /> : null}</td>
                <td>
                  <BiUserPlus
                    size={30}
                    onClick={() => handleUserPlusClick(item.id)}
                    style={{ cursor: 'pointer' }}
                    color="#313B72"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {strings.close[language]}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}