import React, { useContext, useEffect, useState } from 'react';
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
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import { LanguageContext } from './LanguageContext';
import { Select } from '@mui/material';
import { Col, FloatingLabel, Form, Modal, Row, Button } from 'react-bootstrap';

function dateToText(date) {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function textToDate(text) {
    if (!text) return '';
    const [year,month,day] = text.split('-');
    return new Date(year, month - 1, day);
}
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}


function ItemModal({ columns, onSubmit, item, inputs_per_row = 2, icon = <AddIcon /> }) {
    const { language } = useContext(LanguageContext);
    const [show, setShow] = useState(false);
    const fields = columns.map((column) => column.field);
    const [content, setContent] = useState(item ? item : fields.reduce((obj, key) => ({ ...obj, [key]: '' }), {}));
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => setShow(true);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setContent({ ...content, [name]: value });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        // let newContent = columns.reduce((obj, column) => {
        //     if (!content[column.field]) return obj;
        //     if (column.type === 'date') {
        //         return { ...obj, [column.field]: textToDate(content[column.field]) };
        //     }
        //     return { ...obj, [column.field]: content[column.field] };
        // }, {});
        onSubmit(content);
        handleClose();
    };
    return (
        <>
            <IconButton onClick={handleShow}>
                {icon}
            </IconButton>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{strings.add[language]}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {columns.filter(col=>!col.invisible).reduce((rows, key, index) => (index % inputs_per_row === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows, [])
                            .map((row, row_idx) => (
                                <Row className='mb-3' key={`modal-row-${row_idx}`}>
                                    {row.map((column, col_idx) => (
                                        <Col key={col_idx}>
                                            <FloatingLabel label={column.title} controlId={column.field} style={{ color: 'grey' }}  >
                                                {column.type === 'select' ? (
                                                    <Form.Select id={column.id + "-" + column.field} name={column.field} value={content[column.field]} onChange={handleInputChange} placeholder={column.title} required={column.required}>
                                                        <option value="" disabled>{strings.select[language]} {column.title}</option>
                                                        {Object.keys(column.options).map((option) => (
                                                            <option value={option} key={option}>{column.options[option]}</option>
                                                        ))}
                                                    </Form.Select>
                                                ) :
                                                    (column.type === 'textarea') ? (
                                                        <Form.Control as="textarea" name={column.field} value={content[column.field]} onChange={handleInputChange} placeholder={column.title} rows="4" required={column.required} />
                                                    )
                                                        :
                                                        (
                                                            <Form.Control type={column.type} name={column.field} value={content[column.field]} onChange={handleInputChange} placeholder={column.title} required={column.required} />
                                                        )}
                                            </FloatingLabel>
                                        </Col>
                                    ))}
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


function ManagableTableHead({ selected, onSelectAllClick, columns, data, editable, actions, editModal }) {
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
                {columns.filter(col=>!col.invisible).map((col) => (<TableCell key={`head-${col.field}`}>{col.title}</TableCell>))}
            </TableRow>
        </TableHead>
    );
}

function ManagableTableRow({ columns, row, onEdit, selected, setSelected, actions, editModal }) {
    // const myRow = columns.reduce((obj, column) => {
    //     if (column.type === 'date') {
    //         return { ...obj, [column.field]: dateToText(row[column.field]) };
    //     }
    //     return { ...obj, [column.field]: row[column.field] };
    // }, {});
    const { language } = useContext(LanguageContext);
    const [item, setItem] = useState({});
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        let newContent = columns.reduce((obj, column) => {
            if (column.type === 'date') {
                return { ...obj, [column.field]: dateToText(row[column.field]) };
            }
            return { ...obj, [column.field]: row[column.field] };
        }, {});
        setItem(newContent);
    }, [row, columns]);
    const editable = onEdit !== undefined;
    const selectable = setSelected !== undefined;
    const labelId = `enhanced-table-checkbox-${item.id}`;
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditing({ ...editing, [name]: value });
    };
    const handleEdit = (updatedItem) => {
        let newContent = columns.reduce((obj, column) => {
            if (!updatedItem[column.field]) return obj;
            if (column.type === 'date') {
                return { ...obj, [column.field]: textToDate(updatedItem[column.field])};
            }
            return { ...obj, [column.field]: updatedItem[column.field] };
        }, {});
        setItem(updatedItem)
        onEdit(newContent);
        setEditing(false);
    };
    return (<>
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
                            {editing && !editModal ?
                                (
                                    <>
                                        <IconButton onClick={(event) => handleEdit(editing)} >
                                            <DoneIcon />{/* TODO save changes */}
                                        </IconButton>
                                        <IconButton onClick={(event) => setEditing(false)} >
                                            <CloseIcon />
                                        </IconButton>
                                    </>
                                ) : (editModal ? (
                                    <ItemModal columns={columns} onSubmit={handleEdit} item={item} icon={<EditIcon />} />
                                ) : (
                                    <IconButton onClick={(event) => setEditing(item)} >
                                        <EditIcon />
                                    </IconButton>
                                ))
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
            {columns.filter(col=>!col.invisible).map(function (column) {
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
                            :
                            (column.type === 'select') ?
                                column.options[item[column.field]]
                                : item[column.field]}
                    </TableCell>
                );
            })}
        </TableRow>
    </>
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
export default function ManagableTable({ columns, data, onDelete, onEdit, onAdd, actions, globalActions, title, selectable = true, editModal = false }) {
    const language = useContext(LanguageContext);
    const editable = onEdit !== undefined;
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const visibleRows = React.useMemo(
        () =>
            data.slice().sort(getComparator("asc", "firstName")).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [page, rowsPerPage, data],
    );

    useEffect(() => {
        if (data.length / rowsPerPage < page) {
            setPage(0)
        }
    }, [rowsPerPage, data, page])

    const handleEdit = (item) => {
        let id = item.id;
        let data = item
        delete data.id;
        onEdit(id, item);
    };
    const handleDelete = () => {
        let ids = selected.map((item) => item.id);
        // for (let item of selected) {
        //     onDelete(item.id);
        // }

        onDelete(ids);
        setSelected([]);
    }
    return (
        <Paper  className='mt-5' sx={{ width: '100%', overflow: 'hidden' }}>
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
                            <ItemModal columns={columns} onSubmit={onAdd} />
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
                        {visibleRows.map((row, index) => (
                            <ManagableTableRow
                                key={row.id}
                                columns={columns}
                                row={row}
                                onEdit={editable ? handleEdit : undefined}
                                editModal={editModal}
                                selected={isSelected(row)}
                                actions={actions}
                                setSelected={selectable ? (event) => handleSelect(event, row) : undefined}
                            />
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </TableContainer>
        </Paper>
    );
}