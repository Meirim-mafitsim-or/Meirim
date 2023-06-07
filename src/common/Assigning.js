import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import strings from '../static/Strings.json';
import { getDoc } from 'firebase/firestore';
import { BiUserPlus } from 'react-icons/bi';
import { updateDoc } from 'firebase/firestore';

export async function getCampers(event, setFamilies) {
  const EventsSnapshot = await getDoc(event);
  const eventData = EventsSnapshot.data();
  const Campers = eventData.campers;
  setFamilies(eventData.families);
  return Campers;
}

export default function Assigning({ show, onHide, language, event, familyInd }) {
  const [campers, setCampers] = useState([]);
  const [families, setFamilies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('age');
  const [filterByGender, setFilterByGender] = useState('');
  console.log(familyInd);
  useEffect(() => {
    const fetchCampers = async () => {
      try {
        const fetchedCampers = await getCampers(event, setFamilies);
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
        updatedCampers[index].family = families[familyInd];
    
        console.log("", updatedCampers)
        setCampers(updatedCampers);
        console.log("",event)
        // Update the family object in the Firebase Firestore database
        await updateDoc(event, { campers: updatedCampers });
        
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
          {strings.save[language]}
        </Button>
        <Button variant="primary" onClick={onHide}>
          {strings.cancel[language]}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
