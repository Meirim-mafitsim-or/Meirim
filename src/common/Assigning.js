import React, { useState, useEffect } from 'react';
import { Modal, Table, Form , Row, Col} from 'react-bootstrap';
import strings from '../static/Strings.json';
import { db } from './FirebaseApp';
import { collection, getDocs } from 'firebase/firestore';

export async function getCampers() {
  const CampersRef = collection(db, 'campers');
  const CampersSnapshot = await getDocs(CampersRef);
  const Campers = CampersSnapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()));
  return Campers;
}

const Assigning = ({ show, onHide, language }) => {
  const [campers, setCampers] = useState([]);
  const [filterGender, setFilterGender] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchCampers = async () => {
      try {
        const fetchedCampers = await getCampers();
        setCampers(fetchedCampers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCampers();
  }, [filterGender]);

  const handleFilterChange = (event) => {
    setFilterGender(event.target.value);
  };

  const handleSortChange = (event) => {
    const column = event.target.value;
    setSortColumn(column);
    setSortDirection('asc');
  };

  const handleSortDirectionChange = (event) => {
    setSortDirection(event.target.value);
  };

  const sortCampers = (campers) => {
    if (sortColumn === '') {
      return campers;
    }

    const sortedCampers = [...campers];

    sortedCampers.sort((a, b) => {
      if (sortColumn === 'age') {
        return sortDirection === 'asc' ? a.age - b.age : b.age - a.age;
      } else if (sortColumn === 'disability') {
        return sortDirection === 'asc' ? a.disabilityRank - b.disabilityRank : b.disabilityRank - a.disabilityRank;
      }

      return 0;
    });

    return sortedCampers;
  };

  const filteredCampers = campers.filter((camper) => {
    if (filterGender === '') {
      return true;
    } else {
      return camper.gender === filterGender;
    }
  });

  const sortedCampers = sortCampers(filteredCampers);

  return (
    <Modal show={show} onHide={onHide} className="modal-fixed-size">
      <Modal.Header closeButton>
        <Modal.Title>{strings.choose_camper[language]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Row className="filter-sort-container">
          <Col sm={6}>
          <Form.Group controlId="filterGender">
            <Form.Label>{strings.filter_option[language]}</Form.Label>
            <Form.Control as="select" value={filterGender} onChange={handleFilterChange}>
              <option value="">{strings.all[language]}</option>
              <option value="male">{strings.male[language]}</option>
              <option value="female">{strings.female[language]}</option>
              {/* Add more filter options as needed */}
            </Form.Control>
          </Form.Group>
          </Col>
          <Col sm={6}>
          <Form.Group controlId="sortColumn">
            <Form.Label>{strings.sort_by[language]}</Form.Label>
            <Form.Control as="select" value={sortColumn} onChange={handleSortChange}>
              <option value="">{strings.none[language]}</option>
              <option value="age">{strings.age[language]}</option>
              <option value="disability">{strings.disability[language]}</option>
              {/* Add more sort options as needed */}
            </Form.Control>
          </Form.Group>
          </Col>
          {sortColumn && (
            <Col sm={6}>
            <Form.Group controlId="sortDirection">
              <Form.Label>{strings.sort_direction[language]}</Form.Label>
              <Form.Control as="select" value={sortDirection} onChange={handleSortDirectionChange}>
                <option value="asc">{strings.ascending[language]}</option>
                <option value="desc">{strings.descending[language]}</option>
              </Form.Control>
            </Form.Group>
            </Col>

          )}
          
          </Row>
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>{strings.first_name[language]}</th>
              <th>{strings.last_name[language]}</th>
              <th>{strings.gender[language]}</th>
              <th>
                {strings.age[language]}
                {sortColumn === 'age' && (
                  <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
              <th>
                {strings.disability[language]}
                {sortColumn === 'disability' && (
                  <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
              <th>{strings.special_comment[language]}</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {sortedCampers.map((item, index) => (
              <tr key={index}>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.gender}</td>
                <td>{item.age}</td>
                <td>{item.disabilityRank}</td>
                <td>{item.comments}</td>
                {/* Add more table cells based on the object properties */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default Assigning;
