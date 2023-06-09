import React, { useContext, useState } from 'react';
import strings from '../static/Strings.json';
import { LanguageContext } from './LanguageContext';
import {Form, Modal,  Button } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';


  const columns = [
    {
      field: 'firstName',
      headerName: 'First name',
      width: 110,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 110,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
        field: 'disabilityRank',
        headerName: 'Disability Rank',
        type: 'number',
        width: 110,
    },
    {
        field: 'comments',
        headerName: 'Comments',
        type: 'string',
        width: 110,
    },
    {
        field: 'gender',
        headerName: 'Gender',
        type: 'string',
        width: 110,
    },
  ];

 
export default function AddModal({ onAdd, campers, show, setShow}) {
    const { language } = useContext(LanguageContext);
    const [rowSelectionModel, setRowSelectionModel] = useState([]);

    const handleClose = () => setShow(false);


    const handleSubmit = (event) => {
        event.preventDefault();
        const newContent = rowSelectionModel.map((id) => campers.find((camper) => camper.id === id));
        for (const camper of newContent) {
            onAdd(camper);
        }
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