import React, { useContext, useState } from 'react';
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


function AddModal({ columns, onAdd }) {
    const { language } = useContext(LanguageContext);
    const [show, setShow] = useState(false);
    const fields = columns.map((column) => column.field);
    const [content, setContent] = useState(fields.reduce((obj, key) => ({ ...obj, [key]: '' }), {}));

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setContent({ ...content, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onAdd(content);
        setContent(fields.reduce((obj, key) => ({ ...obj, [key]: '' }), {}));
        handleClose();
    };

    return (
        <>
            <IconButton onClick={handleShow}>
                <AddIcon />
            </IconButton>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{strings.add[language]}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {columns.map((column) => (
                            <Row className='mb-3' key={`modal-${column.field}`}>
                                <Col>
                                    <FloatingLabel label={column.title} controlId={column.field}>
                                        {column.type === 'select' ? (
                                            <Form.Select id={column.id + "-" + column.field} name={column.field} value={content[column.field]} onChange={handleInputChange} placeholder={column.title} required>
                                                <option value="" disabled>{strings.select[language]} {column.title}</option>
                                                {Object.keys(column.options).map((option) => (
                                                    <option value={option} key={option}>{column.options[option]}</option>
                                                ))}
                                            </Form.Select>
                                        ) :
                                            (column.type === 'textarea') ? (
                                                <Form.Control as="textarea" name={column.field} value={content[column.field]} onChange={handleInputChange} placeholder={column.title} rows="4" required />
                                            ) :
                                                (
                                                    <Form.Control type={column.type} name={column.field} value={content[column.field]} onChange={handleInputChange} placeholder={column.title} required />
                                                )}
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            {strings.close[language]}
                        </Button>
                        <Button variant="primary" type="submit">
                            {strings.add[language]}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

function ManagableTableHead({ selected, onSelectAllClick, columns, data }) {
    const { language } = useContext(LanguageContext);

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" key={`head-checkbox`}>
                    <Checkbox
                        color="primary"
                        indeterminate={
                            selected.length > 0
                            && selected.length < data.length
                        }
                        checked={
                            data.length > 0
                            && selected.length === data.length
                        }
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': strings.select_all[language],
                        }}
                    />
                </TableCell>

                {/* cell for edit button */}
                <TableCell key="head-edit">
                    {strings.edit[language]}
                </TableCell>
                {columns.map((col) => (
                    <TableCell key={`head-${col.field}`}>{col.title}</TableCell>
                ))}
            </TableRow>
        </TableHead>

    );
}

function ManagableTableRow({ columns, row, onEdit, selected, setSelected }) {
    const { language } = useContext(LanguageContext);
    const [item, setItem] = useState(row);
    const [editing, setEditing] = useState(false);

    const labelId = `enhanced-table-checkbox-${row.id}`;

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setItem({ ...item, [name]: value });
    };

    const handleEdit = () => {
        onEdit(item);
        setEditing(false);
    };

    return (
        <TableRow
            hover
            role="checkbox"
            aria-checked={selected}
            tabIndex={-1}
            key={item.id}
            selected={selected}
            sx={{ cursor: 'pointer' }}
        >
            <TableCell padding="checkbox" key={`${item.id}-checkbox`}>
                <Checkbox
                    onClick={setSelected}
                    color="primary"
                    checked={selected}
                    inputProps={{
                        'aria-labelledby': labelId,
                    }}
                />
            </TableCell>
            <TableCell key={`${item.id}-edit`}>
                <Tooltip title={strings.edit[language]}>
                    <>
                        {editing === item.id ?
                            (
                                <>
                                    <IconButton onClick={(event) => handleEdit()} >
                                        <DoneIcon />{/* TODO save changes */}
                                    </IconButton>
                                    <IconButton onClick={(event) => setEditing(false)} >
                                        <CloseIcon />
                                    </IconButton>
                                </>
                            ) : (
                                <IconButton onClick={(event) => setEditing(item.id)} >
                                    <EditIcon />
                                </IconButton>
                            )
                        }
                    </>
                </Tooltip>
            </TableCell>
            {columns.map(function (column) {
                return (
                    <TableCell key={`${item.id}-${column.field}`}>
                        {editing === item.id ?
                            (
                                (column.type === 'select') ?
                                    <Select
                                        name={column.field}
                                        value={item[column.field]}
                                        type={column.type}
                                        onChange={handleInputChange}>
                                        {Object.keys(column.options).map((option) => (
                                            <MenuItem value={option} key={option}>{column.options[option]}</MenuItem>
                                        ))}
                                    </Select>
                                    : 
                                    (column.type === 'textarea') ?
                                    <TextField
                                        name={column.field}
                                        defaultValue={item[column.field]}
                                        type={column.type}
                                        maxRows={4}
                                        variant="standard"                              
                                        onChange={handleInputChange} 
                                        multiline={true} />
                                    :
                                    <Input
                                        name={column.field}
                                        value={item[column.field]}
                                        type={column.type}
                                        onChange={handleInputChange} />
                            )
                            : (column.type === 'select') ?
                                column.options[item[column.field]]
                                : item[column.field]}
                    </TableCell>

                );
            })}
        </TableRow>
    );
}
/**
 * this component is a table that can be edited and managed by the user, it receives the following props:
 * @param {*} columns an array of objects, each object has the following properties:
 * title: the title of the column
 * field: the field of the column
 * type: the type of the column, can be one of the following: 'text', 'number', 'boolean', 'date', 'select', 'longtext'
 * options: an array of options for the select type
 * @param {*} data an array of objects, each object has the following properties:
 * id: the id of the object
 * value: the value of the field
 * @param {*} onDelete a function that receives an array of ids and deletes the objects with those ids
 * @param {*} onEdit a function that receives an object and edits the object with the same id
 * @param {*} onAdd a function that receives an object and adds it to the table
 * @returns table that can be edited and managed by the user
 */
export default function ManagableTable({ columns, data, onDelete, onEdit, onAdd }) {
    const language = useContext(LanguageContext);

    const [selected, setSelected] = useState([]);
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleSelect = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleEdit = (item) => {
        let id = item.id;
        let data = item
        delete data.id;
        onEdit(id, item);
    };

    const handleDelete = () => {
        for (let id of selected) {
            onDelete(id);
        }
        setSelected([]);
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Toolbar>
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {/* Title */}
                </Typography>
                {selected.length > 0 && (
                    <Tooltip title={strings.delete[language]}>
                        <>
                            <IconButton onClick={handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    </Tooltip>
                )}
                <Tooltip title={strings.add[language]}>
                    <>
                        <AddModal columns={columns} onAdd={onAdd} />
                    </>
                </Tooltip>

            </Toolbar>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <ManagableTableHead selected={selected} onSelectAllClick={handleSelectAllClick} columns={columns} data={data} />
                    <TableBody>
                        {data.map((row, index) => (
                            <ManagableTableRow
                                key={row.id}
                                columns={columns}
                                row={row}
                                onEdit={handleEdit}
                                selected={isSelected(row.id)}
                                setSelected={(event) => handleSelect(event, row.id)}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>

    );
}
