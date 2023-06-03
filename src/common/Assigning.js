import React from 'react';
import { Modal, Table } from 'react-bootstrap';
import strings from '../static/Strings.json';
import { db } from './FirebaseApp';
import { collection, getDocs} from "firebase/firestore"; 
import { useState, useEffect } from 'react';


export async function getCampers() {
    const CampersRef = collection(db, "campers");
    const CampersSnapshot = await getDocs(CampersRef);
    const Campers = CampersSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
    return Campers;
}

const Assigning = ({ show, onHide, language, family}) => {
    const [campers, setCampers] = useState([]);

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
    }, []);


  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{strings.choose_camper[language]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>{strings.first_name[language]}</th>
              <th>{strings.last_name[language]}</th>
              <th>{strings.gender[language]}</th>
              <th>{strings.age[language]}</th>
              <th>{strings.disability[language]}</th>
              <th>{strings.special_comment[language]}</th>


              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {campers.map((item, index) => (
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
