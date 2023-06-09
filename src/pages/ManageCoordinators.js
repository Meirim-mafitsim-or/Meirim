import React, { useEffect, useState, useContext } from 'react';
import { Container} from 'react-bootstrap';
import { getCoordinators, updateCoordinator, deleteCoordinator } from '../common/Database';
import ManagebleTable from '../common/ManagebleTable';
import { LanguageContext } from '../common/LanguageContext';
import strings from '../static/Strings.json';
import AddCoordinatorModal from './AddCoordinator';
import AddIcon from '@mui/icons-material/Add';

export default function ManageCoordinators() {
  const [coordinators, setCoordinators] = useState([]);
  const { language } = useContext(LanguageContext);
  const [showModal, setShowModal] = useState(false);
  const coordinators_columns = [
    {
      title: strings.first_name[language],
      field: 'first_name',
      type: 'text'
    },
    {
      title: strings.last_name[language],
      field: 'last_name',
      type: 'text'
    },
    {
      title: strings.phone_number[language],
      field: 'phone',
      type: 'text'
    },
    {
      title: strings.place_name[language],
      field: 'place_name',
      type: 'number'
    },
    {
      title: strings.email[language],
      field: 'email',
      type: 'email'
    }
  ]

  const actions = [
    {
        icon: <AddIcon />,
        title: strings.add_coordinator[language],
        onClick: () => setShowModal(true)
    }
    ]

  useEffect(() => {
    getCoordinators().then(coordinators => {
      setCoordinators(coordinators);
    });
  }, []);
  const handleAddCoordinator = () => {
    getCoordinators().then(Coordinators => setCoordinators(Coordinators))
  }

  const handleUpdateCoordinator = (coordinatorId, coordinators_columns) => {
    updateCoordinator(coordinatorId, coordinators_columns).then(getCoordinators).then(coordinators => setCoordinators(coordinators));
  }

  const handleDeleteCoordinator = (coordinatorId) => {
    deleteCoordinator(coordinatorId).then(getCoordinators).then(coordinators => setCoordinators(coordinators));
  }

  return (
    <Container>
        <AddCoordinatorModal show={showModal} setShow={setShowModal} onSuccess={handleAddCoordinator} />
        <ManagebleTable
          data={coordinators}
          columns={coordinators_columns}
          globalActions={actions}
          onEdit={handleUpdateCoordinator}
          onDelete={handleDeleteCoordinator} />
    </Container>
  )
}
