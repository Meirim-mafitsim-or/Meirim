import React, { useContext, useState } from 'react';
import strings from '../static/Strings.json';
import { LanguageContext } from './LanguageContext';
import {Form, Modal,  Button } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
 
export default function AddModal({ onAdd, campers, show, setShow}) {
    const { language } = useContext(LanguageContext);
    const columns = [
      {headerName: strings.camper_id[language], field: 'camper_id', type: 'text'},
      {headerName: strings.first_name[language], field: 'first_name', type: 'text'},
      {headerName: strings.last_name[language], field: 'last_name', type: 'text'},
      {headerName: strings.birth_date[language], field: 'birth_date', type: 'date'},
      {headerName: strings.gender[language], field: 'gender', type: 'select', options: 
        {'male': strings.male[language], 'female': strings.female[language], 'other': strings.other[language] }
      },
      {headerName: strings.city[language],field: 'city',type: 'text'},
      {headerName: strings.address[language],field: 'address',type: 'text'},
      {headerName: strings.frame[language], field: 'frame', type: 'text' },
      { headerName: strings.disability_definition[language], field: 'disability_definition', type: 'text' },
      { headerName: strings.functioning_level[language], field: 'functioning_level', type: 'select',
        options: { 'high': strings.high[language], 'medium': strings.medium[language], 'low': strings.low[language] }
      },
      { headerName: strings.allergies[language], field: 'allergies', type: 'text' },
      { headerName: strings.parent_name[language], field: 'parent_name', type: 'text' },
      { headerName: strings.parent_phone[language], field: 'parent_phone', type: 'text' },
      { headerName: strings.branch[language], field: 'branch', type: 'text' },
      { headerName: strings.tutor[language], field: 'tutor', type: 'text' },
      { headerName: strings.tutor_phone[language], field: 'tutor_phone', type: 'text' },
      { headerName: strings.special_comment[language], field: 'comments', type: 'textarea' }
    ]
  
    const [rowSelectionModel, setRowSelectionModel] = useState([]);

    const handleClose = () => setShow(false);


    const handleSubmit = (event) => {
        event.preventDefault();
        const newContent = rowSelectionModel.map((id) => campers.find((camper) => camper.id === id));
            onAdd(newContent);
        handleClose();
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} className="modal-xl">
                <Modal.Header closeButton>
                    <Modal.Title>{strings.add[language]}</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                       
                            <DataGrid
                            rows={campers}
                            columns={columns}
                            initialState={{
                              pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                              },
                              columns: {
                                columnVisibilityModel: {
                                  // Hide columns status and traderName, the other columns will remain visible
                                  camper_id: false,
                                  city: false,
                                  address: false,
                                  disabilityDefinition: false,
                                  allergies: false,
                                  parentName: false,
                                  parentPhone: false,
                                  branch: false,
                                  tutor: false,
                                  tutorPhone: false,
                                  comments: false,

                                },
                              },                          
                            }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                setRowSelectionModel(newRowSelectionModel);
                              }}
                              rowSelectionModel={rowSelectionModel}
                              
                          />
                      
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            {strings.close[language]}
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            {strings.add[language]}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}