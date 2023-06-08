import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import strings from '../static/Strings.json';
import { BiUserPlus } from 'react-icons/bi';
import { db } from '../common/FirebaseApp';
import { updateDoc } from 'firebase/firestore';
import { collection, doc, getDoc} from "firebase/firestore"; 
import _ from 'lodash';


export async function getCampers(event, setRegID) {
  const EventsSnapshot = await getDoc(event);
  const eventData = EventsSnapshot.data();
  console.log("", eventData);
  setRegID(eventData.registrationId);
  const Campers = eventData.campers;
  return Campers;
}

export default function Assigning({ show, onHide, language, event , selectedFamily}) {
  const [campers, setCampers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('age');
  const [filterByGender, setFilterByGender] = useState('');
  const [regID, setRegID] = useState(null);

  useEffect(() => {
    const fetchCampers = async () => {
      try {
        const fetchedCampers = await getCampers(event, setRegID);
        setCampers(fetchedCampers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCampers(); // Call the fetchCampers function

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  // Filter campers based on search query and gender filter
  const filteredCampers = campers.filter(
    (camper) =>
      (camper.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camper.lastName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!filterByGender || camper.gender === filterByGender)
  );

  // Sort campers based on the selected sorting option
  const sortedCampers = filteredCampers.sort((a, b) => {
    if (sortBy === 'age') {
      return a.age - b.age;
    }
    return 0;
  });

    const handleUserPlusClick = async (index) => {
        const updatedCampers = [...campers];
        updatedCampers[index].assinging = true;
        updatedCampers[index].family = selectedFamily.id;

        const familiesCol = collection(db, 'familiesRegistration');
        const cur_families = doc(familiesCol, regID);
    
        const FamiliesSnapshot = await getDoc(cur_families);
        const familiesData = FamiliesSnapshot.data();
    
        const families = familiesData.families;
        // const desiredFamily = families.find((check_family) =>_.isEqual(selectedFamily, check_family));
        const desiredFamily = families.find((check_family) => check_family.id === selectedFamily.id);
        console.log("", desiredFamily)

        desiredFamily.camper =  updatedCampers[index].id;
        desiredFamily.assinging = true;
    
        // Update the family object in the Firebase Firestore database
        await updateDoc(event, { campers: updatedCampers });
        await updateDoc(cur_families, { families: families });
        onHide();
        
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

        <table className="table table-striped">
          <thead>
            <tr>
              <th>{strings.id[language]}</th>
              <th>{strings.first_name[language]}</th>
              <th>{strings.last_name[language]}</th>
              <th>{strings.gender[language]}</th>
              <th>{strings.age[language]}</th>
              <th>{strings.special_comment[language]}</th>
              <th>{strings.choose[language]}</th>
            </tr>
          </thead>
          <tbody>
            {sortedCampers.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.gender}</td>
                <td>{item.age}</td>
                <td>{item.comments}</td>
                <td>
                  <BiUserPlus size={30} 
                  onClick={() => handleUserPlusClick(index)}
                  style={{ cursor: 'pointer' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {strings.cancel[language]}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
