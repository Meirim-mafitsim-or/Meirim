import React, { useContext, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
                                            )
                                                :
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

function ManagableTableHead({ selected, onSelectAllClick, columns, data, editable, actions }) {
    const { language } = useContext(LanguageContext);
    const selectable = onSelectAllClick !== undefined;
    return (
        <TableHead>
            <TableRow>
                {selectable && (
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
                )}

                {/* cell for edit button */}
                {editable && (
                    <TableCell key="head-edit">
                        {strings.edit[language]}
                    </TableCell>
                )}
                {actions && actions.map((action) => (<TableCell key={`head-${action.title}`}>{action.title}</TableCell>))}
                {columns.map((col) => (<TableCell key={`head-${col.field}`}>{col.title}</TableCell>))}
            </TableRow>
        </TableHead>

    );
}

function ManagableTableRow({ columns, row, onEdit, selected, setSelected, actions }) {
    const { language } = useContext(LanguageContext);
    const [item, setItem] = useState(row);
    const [editing, setEditing] = useState(false);

    const editable = onEdit !== undefined;
    const selectable = setSelected !== undefined;
    const labelId = `enhanced-table-checkbox-${row.id}`;

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditing({ ...item, [name]: value });
    };

    const handleEdit = () => {
        setItem(editing)
        onEdit(editing);
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
            {selectable && (
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
            )}
            {editable && (
                <TableCell key={`${item.id}-edit`}>
                    <Tooltip title={strings.edit[language]}>
                        <>
                            {editing ?
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
                                    <IconButton onClick={(event) => setEditing(item)} >
                                        <EditIcon />
                                    </IconButton>
                                )
                            }
                        </>
                    </Tooltip>
                </TableCell>
            )}
            {actions && actions.map((action) => (
                <tableCell key={`${item.id}-${action.title}`}>
                    <Tooltip title={action.title}>
                        <IconButton onClick={(event) => action.onClick(item)} >
                            {action.icon}
                        </IconButton>
                    </Tooltip>
                </tableCell>
            ))}
            {columns.map(function (column) {
                return (
                    <TableCell key={`${item.id}-${column.field}`}>
                        {editing ?
                            (
                                (column.type === 'select') ?
                                    <Select
                                        name={column.field}
                                        value={editing[column.field]}
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
                                            defaultValue={editing[column.field]}
                                            type={column.type}
                                            maxRows={4}
                                            variant="standard"
                                            onChange={handleInputChange}
                                            multiline={true} />
                                        :
                                        <Input
                                            name={column.field}
                                            value={editing[column.field]}
                                            type={column.type}
                                            onChange={handleInputChange} />
                            )
                            : (column.type === 'select') ?
                                column.options[item[column.field]]
                                // : (column.type === 'textarea' && item[column.field].length) ?
                                //     <Accordion style={{
                                //         boxShadow: 'none',
                                //         backgroundColor: 'transparent',
                                //         textAlign: 'start',
                                //         padding: 0,
                                //         margin: 0,
                                //         minHeight: 0,

                                //     }}>
                                //         <AccordionSummary
                                //             expandIcon={<ExpandMoreIcon />}
                                //             aria-controls="panel1a-content"
                                //             id="panel1a-header"
                                //             style={{
                                //                 paddingBottom: 0,
                                //                 margin: 0,
                                //                 minHeight: 0,
                                //             }}
                                //             padding={0}
                                //         >
                                //             <Typography>
                                //                 {item[column.field].split('\n')[0]} ...
                                //             </Typography>
                                //         </AccordionSummary>
                                //         <AccordionDetails>
                                //             {item[column.field].split('\n').map((line, index) => {
                                //                 return index !== 0 ? <Typography key={index}>{line}</Typography> : null;
                                //             })}
                                //         </AccordionDetails>
                                //     </Accordion>
                                :
                                item[column.field]}
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
 * type: the type of the column, can be one of the following: 'text', 'number', 'boolean', 'date', 'select', 'textarea'
 * options: an array of options for the select type
 * @param {*} data an array of objects, each object has the following properties:
 * id: the id of the object
 * value: the value of the field
 * @param {*} onDelete a function that receives an array of ids and deletes the objects with those ids
 * @param {*} onEdit a function that receives an object and edits the object with the same id
 * @param {*} onAdd a function that receives an object and adds it to the table
 * @param {*} actions an array of objects, each object has the following properties:
 * title: the title of the action
 * icon: the icon of the action
 * onClick: a function that receives an object and performs the action on it
 * @param {*} globalActions an array of objects, each object has the following properties:
 * title: the title of the action
 * icon: the icon of the action
 * onClick: a function that receives an array of objects and performs the action on them
 * @returns table that can be edited and managed by the user
 */
export default function ManagableTable({ columns, data, onDelete, onEdit, onAdd, actions, globalActions, title, selectable = true }) {
    const language = useContext(LanguageContext);

    const editable = onEdit !== undefined;
    const [selected, setSelected] = useState([]);
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = data;
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleSelect = (event, item) => {
        const selectedIndex = selected.indexOf(item);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, item);
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

    const isSelected = (item) => selected.indexOf(item) !== -1;

    const handleEdit = (item) => {
        let id = item.id;
        let data = item
        delete data.id;
        onEdit(id, item);
    };

    const handleDelete = () => {
        for (let item of selected) {
            onDelete(item.id);
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
                    {title}
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
                {globalActions && globalActions.map((action, index) => {
                    return (
                        <Tooltip title={action.title} key={index}>
                            <>
                                <IconButton onClick={(event) => action.onClick(selected)}>
                                    {action.icon}
                                </IconButton>
                            </>
                        </Tooltip>
                    )
                })}
                {onAdd && (
                    <Tooltip title={strings.add[language]}>
                        <>
                            <AddModal columns={columns} onAdd={onAdd} />
                        </>
                    </Tooltip>
                )}

            </Toolbar>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <ManagableTableHead
                        selected={selected}
                        onSelectAllClick={selectable ? handleSelectAllClick : undefined}
                        columns={columns}
                        data={data}
                        editable={editable}
                        globalActions={globalActions}
                    />
                    <TableBody>
                        {data.map((row, index) => (
                            <ManagableTableRow
                                key={row.id}
                                columns={columns}
                                row={row}
                                onEdit={editable ? handleEdit : undefined}
                                selected={isSelected(row)}
                                actions={actions}
                                setSelected={selectable ? (event) => handleSelect(event, row) : undefined}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}