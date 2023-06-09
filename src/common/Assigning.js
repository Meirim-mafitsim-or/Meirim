import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import strings from '../static/Strings.json';
import { BiUserPlus } from 'react-icons/bi';
import { db } from '../common/FirebaseApp';
import { updateDoc } from 'firebase/firestore';
import { collection, doc, getDoc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { BiCheck } from 'react-icons/bi';

export async function getCampers(event, setRegID) {
  const EventsSnapshot = await getDoc(event);
  const eventData = EventsSnapshot.data();
  setRegID(eventData.registrationId);
  const Campers = eventData.campers;
  return Campers;
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
      (camper.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camper.lastName.toLowerCase().includes(searchQuery.toLowerCase())) &&
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

  // Add a family to the assignings document
  const addFamilyToAssignings = async (camperID) => {
    if (!show) {
      return;
    }

    const { assigning, assigningsArray } = await getFamilyFromAssignings(settlement);
    const collectionRef = collection(db, 'assignings');
    const docRef = doc(collectionRef, settlement);
    if (!assigning) {
      // Create a new object with the selected family details
      const newAssigning = {
        familyName: selectedFamily.last_name,
        phoneNumber: selectedFamily.phone_number,
        campersId: [camperID],
      };

      // Add the new object to the assigningsArray
      assigningsArray.push(newAssigning);

      // Update the Firestore document
      await updateDoc(docRef, { assignings: assigningsArray });

      console.log('New object added to assigningsArray:', newAssigning);
    } else {
      if (!assigning.campersId.includes(camperID)) {
        assigning.campersId.push(camperID);
        await updateDoc(docRef, { assignings: assigningsArray });
      }
    }
  };

  // Check if the camper ID exists in the assignings array for the selected family
  const checkCamperIDInAssigningsArray = async (last_name, phone_number) => {
    const { assigningExists: ignored, assigningsArray } = await getFamilyFromAssignings(settlement);
    if (!assigningsArray || assigningsArray.length === 0) {
      return;
    }

    const foundAssigning = assigningsArray.find(
      (assigning) => assigning.familyName === last_name && assigning.phoneNumber === phone_number
    );

    if (foundAssigning) {
      await setHistoryAss(foundAssigning.campersId);
      return foundAssigning.campersId;
    }

    return [];
  };

  // Handle click event when the user clicks the "User Plus" icon to assign a camper to a family
  const handleUserPlusClick = async (index) => {
    if (show) {
      addFamilyToAssignings(campers[index].id);
    }

    const updatedCampers = [...campers];
    const familiesCol = collection(db, 'familiesRegistration');
    const cur_families = doc(familiesCol, regID);

    const FamiliesSnapshot = await getDoc(cur_families);
    const familiesData = FamiliesSnapshot.data();

    const families = familiesData.families;

    if (updatedCampers[index].assigning) {
      const confirmed = window.confirm(strings.to_change_assigning[language]);
      if (!confirmed) {
        return; // Don't proceed further if not confirmed
      }
      const lastFamily = families.find((check_family) => check_family.id === updatedCampers[index].family);
      if (lastFamily) {
        lastFamily.assigning = false;
        lastFamily.camper = null;
      }
    }

    updatedCampers[index].assigning = true;
    updatedCampers[index].family = selectedFamily.id;

    const desiredFamilyIndex = families.findIndex((check_family) => check_family.id === selectedFamily.id);
    if (desiredFamilyIndex !== -1) {
      families[desiredFamilyIndex].camper = updatedCampers[index].id;
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
            onChange={(e) => setShowFilteredCampers(e.target.checked)}
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
                <td>{item.comments}</td>
                <td>{item.assigning ? <BiCheck size={20} /> : null}</td>
                <td>
                  <BiUserPlus
                    size={30}
                    onClick={() => handleUserPlusClick(index)}
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
