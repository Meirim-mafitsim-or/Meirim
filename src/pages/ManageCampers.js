import React, { useEffect, useState, useContext } from 'react';
import {Modal, Button,Container } from 'react-bootstrap';
import { addCamper, getCampers, updateCamper, deleteCampers, addManyCampers } from '../common/Database';
import ManagebleTable from '../common/ManagebleTable';
import { LanguageContext } from '../common/LanguageContext';
import strings from '../static/Strings.json';
import PostAddIcon from '@mui/icons-material/PostAdd';
import * as XLSX from 'xlsx';
import moment from 'moment';

function parseDate(dateString) {
  const formats = [
    'YYYY-MM-DD',
    'MM/DD/YYYY',
    'MM/DD/YY',
    'DD/MM/YYYY',
    'DD/MM/YY',
    'YYYY/MM/DD',
    'DD.MM.YYYY',
    'D.MM.YYYY',
    'DD.M.YYYY',
    'D.M.YYYY',
  ];

  for (let i = 0; i < formats.length; i++) {
    const format = formats[i];
    const date = moment(dateString, format, true);
    if (date.isValid()) {
      return date.toDate();
    }
  }

  return null;
}

function campersEscapeDate(campers){
  return campers.map((camper) => {
    if (camper.birth_date)
      camper.birth_date = new Date(camper.birth_date.seconds * 1000);
    return camper;
  });
}


function CampersPreviewModal({campers, setCampers, show, setShow, handleSubmit }){
  const { language } = useContext(LanguageContext);
  const [error, setError] = useState(false);

  const campers_columns = [
    {title: strings.id[language], field: 'id', type: 'text', invisible: true, readOnly: true},
    {title: strings.camper_id[language], field: 'camper_id', type: 'text'},
    {title: strings.first_name[language], field: 'first_name', type: 'text'},
    {title: strings.last_name[language], field: 'last_name', type: 'text'},
    {title: strings.birth_date[language], field: 'birth_date', type: 'date'},
    {title: strings.gender[language], field: 'gender', type: 'select', options: 
      {'male': strings.male[language], 'female': strings.female[language], 'other': strings.other[language] }
    },
    {title: strings.city[language],field: 'city',type: 'text'},
    {title: strings.address[language],field: 'address',type: 'text'},
    {title: strings.frame[language], field: 'frame', type: 'text' },
    { title: strings.disability_definition[language], field: 'disability_definition', type: 'text' },
    { title: strings.functioning_level[language], field: 'functioning_level', type: 'select',
      options: { 'high': strings.high[language], 'medium': strings.medium[language], 'low': strings.low[language] }
    },
    { title: strings.allergies[language], field: 'allergies', type: 'text' },
    { title: strings.parent_name[language], field: 'parent_name', type: 'text' },
    { title: strings.parent_phone[language], field: 'parent_phone', type: 'text' },
    { title: strings.branch[language], field: 'branch', type: 'text' },
    { title: strings.tutor[language], field: 'tutor', type: 'text' },
    { title: strings.tutor_phone[language], field: 'tutor_phone', type: 'text' },
    { title: strings.special_comment[language], field: 'comments', type: 'textarea' }
  ]


  const handleUpdateCapmer = (camperId,campers_columns) => {
    // const camperId = campers_columns.id;
    // delete campers_columns.id;
    console.log("handleUpdateCapmer",camperId,campers_columns);
    const newCampers = campers.map(camper => (camper.id === camperId) ? { ...camper, ...campers_columns} : camper)

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
        <Modal.Title>{strings.add_camper[language]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ManagebleTable
          title={strings.campers[language]}
          data={campers}
          columns={campers_columns}
          onEdit={handleUpdateCapmer}
          onDelete={handleDeleteCampers}
          />
      </Modal.Body>
      <Modal.Footer>
        {campers.filter(camper=>!camper.camper_id).length>0 && <p style={{color: 'red'}}>{error}</p>}
        <Button variant="secondary" onClick={() => setShow(false)}>
          {strings.close[language]}
        </Button>
        <Button variant="primary" onClick={() => handleSubmitCampers(campers)}>
          {strings.add[language]}
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
    {title: strings.camper_id[language], field: 'id', type: 'text', invisible: true, readOnly: true},
    {title: strings.first_name[language], field: 'first_name', type: 'text',},
    {title: strings.last_name[language], field: 'last_name', type: 'text'},
    {title: strings.birth_date[language], field: 'birth_date', type: 'date', invisible: true, validate: rowData => rowData instanceof Date && !isNaN(rowData)},
    {title: strings.gender[language], field: 'gender', type: 'select', options: 
      {'male': strings.male[language], 'female': strings.female[language], 'other': strings.other[language] }
    },
    {title: strings.city[language],field: 'city',type: 'text', invisible: true},
    {title: strings.address[language],field: 'address',type: 'text', invisible: true},
    {title: strings.frame[language], field: 'frame', type: 'text' },
    { title: strings.disability_definition[language], field: 'disability_definition', type: 'text' },
    { title: strings.functioning_level[language], field: 'functioning_level', type: 'select',
      options: { 'high': strings.high[language], 'medium': strings.medium[language], 'low': strings.low[language] }
    },
    { title: strings.allergies[language], field: 'allergies', type: 'text' },
    { title: strings.parent_name[language], field: 'parent_name', type: 'text', invisible: true },
    { title: strings.parent_phone[language], field: 'parent_phone', type: 'text', invisible: true, validate: rowData => rowData.match(/^[0-9]{10}$/)},
    { title: strings.branch[language], field: 'branch', type: 'text' },
    { title: strings.tutor[language], field: 'tutor', type: 'text' },
    { title: strings.tutor_phone[language], field: 'tutor_phone', type: 'text', validate: rowData => rowData.match(/^[0-9]{10}$/)},
    { title: strings.special_comment[language], field: 'comments', type: 'textarea' }
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
              // birth_date to date object
              let genderOptions = campers_columns.filter((item => item.field === 'gender'))[0].options;
              // find gender key or value in the options and retrun the key or null
              if (Object.values(genderOptions).includes(item['gender'])) {
                item['gender'] = Object.keys(genderOptions).find(key => genderOptions[key] === item['gender']);
              }
              let functioning_levelOptions = campers_columns.filter((item => item.field === 'functioning_level'))[0].options;
              if (Object.values(functioning_levelOptions).includes(item['functioning_level'])) {
                item['functioning_level'] = Object.keys(functioning_levelOptions).find(key => functioning_levelOptions[key] === item['functioning_level']);
              }

              item['birth_date'] = parseDate(item['birth_date']);
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
    getCampers().then(campersEscapeDate).then(campers =>setCampers(campers));
  }, []);
  const handleAddCamper = (camper) => {
    addCamper(camper).then(getCampers).then(campersEscapeDate).then(campers => setCampers(campers));
  }

  const handleUpdateCapmer = (camperId, campers_columns) => {
    delete campers_columns.id;
    updateCamper(camperId, campers_columns).then(getCampers).then(campersEscapeDate).then(campers => setCampers(campers));
  }

  const handleDeleteCampers = (camperId) => {
    const confirmed = window.confirm(strings.delete_confirm_camper[language]);
    if (confirmed) 
      deleteCampers(camperId).then(getCampers).then(campersEscapeDate).then(campers => setCampers(campers));
  }

  const handleAddManyCampers = (campers) => {
    const newCampers = campers.map((camper) => ({ ...camper, id: camper.camper_id }));
    
    // filter out columns that are not in the database
    newCampers.forEach((camper) => {
      Object.keys(camper).forEach((key) => {
        if (!campers_columns.find((column) => column.field === key)) {
          delete camper[key];
        }
        camper.birth_date = new Date(camper.birth_date);
        if (camper[key]===undefined) delete camper[key];
      });
    });
    addManyCampers(newCampers).then(getCampers).then(campersEscapeDate).then(campers => setCampers(campers));
    setShow(false);
  }

  return (
    <Container className='pt-5'>
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
    </Container>
  )
}
