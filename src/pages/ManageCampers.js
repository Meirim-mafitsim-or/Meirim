import React, { useEffect, useState, useContext } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { addCamper, getCampers, updateCamper, deleteCamper } from '../common/Database';
import ManagebleTable from '../common/ManagebleTable';
import { LanguageContext } from '../common/LanguageContext';
import strings from '../static/Strings.json';

export default function ManageCampers() {
  const [campers, setCampers] = useState([]);
  const { language } = useContext(LanguageContext);

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

  useEffect(() => {
    getCampers().then(campers => {
      setCampers(campers);
    });
  }, []);
  const handleAddCamper = (camper) => {
    addCamper(camper).then(getCampers).then(campers => setCampers(campers));
  }

  const handleUpdateCapmer = (camperId, campers_columns) => {
    updateCamper(camperId, campers_columns).then(getCampers).then(campers => setCampers(campers));
  }

  const handleDeleteCamper = (camperId) => {
    deleteCamper(camperId).then(getCampers).then(campers => setCampers(campers));
  }

  return (
    <Container>
      {campers.length <= 0 ?
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        :
        <ManagebleTable
          data={campers}
          columns={campers_columns}
          onAdd={handleAddCamper}
          onEdit={handleUpdateCapmer}
          onDelete={handleDeleteCamper} />
      }
    </Container>
  )
}
