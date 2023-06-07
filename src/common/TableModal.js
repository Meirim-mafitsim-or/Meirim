import React, { useContext, useState,useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import strings from '../static/Strings.json';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { LanguageContext } from './LanguageContext';
import { Select } from '@mui/material';
import { Col, FloatingLabel, Form, Modal, Row, Button } from 'react-bootstrap';
import { db, storage } from '../common/FirebaseApp';
import { collection, getDocs } from "firebase/firestore";
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
    console.log("hi",campers);
    const { language } = useContext(LanguageContext);
    // const [show, setShow] = useState(false);
    const fields = columns.map((column) => column.field);
    const [content, setContent] = useState(fields.reduce((obj, key) => ({ ...obj, [key]: '' }), {}));
    const [rowSelectionModel, setRowSelectionModel] = useState([]);

    // useEffect(() => {
    //     const fetchcampers = async () => {
    //     try{
    //         const Camper = await getcampers();
    //         console.log(Camper);
    //         setcampers(Camper);
    //         const camp = Camper.filter((camper) => !campers.includes(camper.id));
    //         console.log(camp);
    //         console.log("kjjjj");
    //         setcampers(camp);
    //     }
    //     catch(error){
    //         console.log(error);
    //     }
    //     };
    //     fetchcampers();

    // }, []);

     




    console.log(campers);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setContent({ ...content, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newContent = rowSelectionModel.map((id) => campers.find((camper) => camper.id === id));
        for (const camper of newContent) {
            onAdd(camper);
        }
        console.log(newContent);
        console.log(rowSelectionModel);
        // onAdd(content);
        // setContent(fields.reduce((obj, key) => ({ ...obj, [key]: '' }), {}));
        handleClose();
        // console.log(content);

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