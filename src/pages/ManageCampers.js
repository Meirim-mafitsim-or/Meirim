import React, { useEffect, useState, useContext } from 'react';
import {Modal, Button } from 'react-bootstrap';
import { addCamper, getCampers, updateCamper, deleteCampers, addManyCampers } from '../common/Database';
import ManagebleTable from '../common/ManagebleTable';
import { LanguageContext } from '../common/LanguageContext';
import strings from '../static/Strings.json';
import PostAddIcon from '@mui/icons-material/PostAdd';
import * as XLSX from 'xlsx';

function CampersPreviewModal({campers, setCampers, show, setShow, handleSubmit }){
  const { language } = useContext(LanguageContext);
  const [error, setError] = useState(false);

  const campers_columns = [
    {title: strings.camper_id[language], field: 'camper_id', type: 'text'},
    {title: strings.first_name[language], field: 'firstName', type: 'text'},
    {title: strings.last_name[language], field: 'lastName', type: 'text'},
    {title: strings.birth_date[language], field: 'birthDate', type: 'date'},
    {title: strings.gender[language], field: 'gender', type: 'select', options: 
      {'male': strings.male[language], 'female': strings.female[language], 'other': strings.other[language] }
    },
    {title: strings.city[language],field: 'city',type: 'text'},
    {title: strings.address[language],field: 'address',type: 'text'},
    {title: strings.frame[language], field: 'frame', type: 'text' },
    { title: strings.disability_definition[language], field: 'disabilityDefinition', type: 'text' },
    { title: strings.functioning_level[language], field: 'functioningLevel', type: 'select',
      options: { 'high': strings.high[language], 'medium': strings.medium[language], 'low': strings.low[language] }
    },
    { title: strings.allergies[language], field: 'allergies', type: 'text' },
    { title: strings.parent_name[language], field: 'parentName', type: 'text' },
    { title: strings.parent_phone[language], field: 'parentPhone', type: 'text' },
    { title: strings.branch[language], field: 'branch', type: 'text' },
    { title: strings.tutor[language], field: 'tutor', type: 'text' },
    { title: strings.tutor_phone[language], field: 'tutorPhone', type: 'text' },
    { title: strings.special_comment[language], field: 'comments', type: 'textarea' }
  ]


  const handleUpdateCapmer = (camperId, campers_columns) => {
    const newCampers = campers.map(camper => (camper.id === camperId) ? { ...camper, ...campers_columns} : camper);
    setCampers(newCampers);
  }
  
  const handleDeleteCampers = async (camperIds) => {
    const newCampers = campers.filter(camper => !camperIds.includes(camper.id));
    await setCampers(newCampers);
  }
  
  const handleSubmitCampers = (campers) => {
    // if any of the campers is not valid, show error message
    if (campers.filter(camper=>!camper.camper_id).length>0){
      // TODO: show error message
      setError('Some campers are missing camper id');
      return;
    }


    
    let newCampers = campers.map(camper => ({...camper, id: camper.camper_id}));
    // if all campers are valid, add them to the database
    handleSubmit(newCampers);
  }


  return (
    <Modal className="modal-xl" show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ManagebleTable
          data={campers}
          columns={campers_columns}
          onEdit={handleUpdateCapmer}
          onDelete={handleDeleteCampers}
          />
      </Modal.Body>
      <Modal.Footer>
        {campers.filter(camper=>!camper.camper_id).length>0 && <p style={{color: 'red'}}>{error}</p>}
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleSubmitCampers(campers)}>
          Save Changes
        </Button>
        {/* if any of the campers is not valid, show error message */}
      </Modal.Footer>
    </Modal>
  );
}


export default function ManageCampers() {
  const [campers, setCampers] = useState([]);
  const { language } = useContext(LanguageContext);
  const [show, setShow] = useState(false);
  const [newCampers, setNewCampers] = useState([]);
  
  const campers_columns = [
    {
      title: strings.camper_id[language],
      field: 'id',
      type: 'text',
    },
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
      title: strings.birth_date[language],
      field: 'birthDate',
      type: 'date'
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
      title: strings.city[language],
      field: 'city',
      type: 'text'
    },
    {
      title: strings.address[language],
      field: 'address',
      type: 'text'
    },
    {
      title: strings.frame[language],
      field: 'frame',
      type: 'text'
    },
    {
      title: strings.disability_definition[language],
      field: 'disabilityDefinition',
      type: 'text'
    },
    {
      title: strings.functioning_level[language],
      field: 'functioningLevel',
      type: 'select',
      options: {
        'high': strings.high[language],
        'medium': strings.medium[language],
        'low': strings.low[language]
      }
    },
    {
      title: strings.allergies[language],
      field: 'allergies',
      type: 'text'
    },
    {
      title: strings.parent_name[language],
      field: 'parentName',
      type: 'text'
    },
    {
      title: strings.parent_phone[language],
      field: 'parentPhone',
      type: 'text'
    },
    {
      title: strings.branch[language],
      field: 'branch',
      type: 'text'
    },
    {
      title: strings.tutor[language],
      field: 'tutor',
      type: 'text'
    },
    {
      title: strings.tutor_phone[language],
      field: 'tutorPhone',
      type: 'text'
    },
    {
      title: strings.special_comment[language],
      field: 'comments',
      type: 'textarea'
    }
  ]

  const globalActions = [
    {
      // add from excel file action
      icon: <PostAddIcon />,
      title: strings.add[language],
      onClick: () => {
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.xlsx, .xls, .csv';
        fileInput.onchange = (event) => {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const headers = rows[0];
            const titles = headers.map((header) => {
              let col = campers_columns.find((column) => column.title === header);
              return col ? col.field : header;
            });
            const json_data = rows.slice(1).map((row, i) => {
              const item = {};
              titles.forEach((header, index) => {
                item[header] = row[index];
              });
              item['camper_id'] = item['id'];
              item['id'] = i;
              return item;
            });
            // render preview modal
            setNewCampers(json_data);
            setShow(true);
          };
          reader.readAsArrayBuffer(file);
        };
        fileInput.click();
      }
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
    let id = campers_columns.id;
    delete campers_columns.id;
    updateCamper(id, campers_columns).then(getCampers).then(campers => setCampers(campers));
  }

  const handleDeleteCampers = (camperId) => {
    
    deleteCampers(camperId).then(getCampers).then(campers => setCampers(campers));
  }

  const handleAddManyCampers = (campers) => {
    const newCampers = campers.map((camper) => ({ ...camper, id: camper.camper_id }));
    
    // filter out columns that are not in the database
    newCampers.forEach((camper) => {
      Object.keys(camper).forEach((key) => {
        if (!campers_columns.find((column) => column.field === key)) {
          delete camper[key];
        }
      });
    });
    addManyCampers(newCampers).then(getCampers).then(campers => setCampers(campers));
    setShow(false);
  }

  return (
    <>
      <CampersPreviewModal
        campers={newCampers}
        setCampers={setNewCampers}
        // campers_columns={campers_columns}
        show={show}
        setShow={setShow}
        handleSubmit={handleAddManyCampers}
      />
      <ManagebleTable
        title={strings.campers[language]}
        data={campers}
        columns={campers_columns}
        globalActions={globalActions}
        onAdd={handleAddCamper}
        onEdit={handleUpdateCapmer}
        onDelete={handleDeleteCampers}
        editModal={true}
      />

    </>
  )
}
