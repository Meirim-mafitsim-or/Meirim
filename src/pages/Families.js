import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import { db } from '../common/FirebaseApp';
import { collection, doc, getDoc} from "firebase/firestore"; 
import { useLocation } from 'react-router-dom';
import strings from '../static/Strings.json';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Assigning from "../common/Assigning";


export async function getFamilies(id) {
    const events = collection(db, 'events');
    const cur_event = doc(events, id);
    const EventsSnapshot = await getDoc(cur_event);
    const eventData = EventsSnapshot.data();
    return eventData.families || [];
  }


export default function Families() {
    const { language } = React.useContext(LanguageContext);
    const [families, setFamilies] = useState([]);
    const location = useLocation();
    const [pathSuffix, setPathSuffix] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedFamily, setSelectedFamily] = useState(null);


    useEffect(() => {
        const path = location.pathname;
        const parts = path.split('/');
        const suffix = parts[parts.length-1];
        setPathSuffix(suffix);
    }, [location]);
    
    useEffect(() => {
        if (pathSuffix) {
          getFamilies(pathSuffix)
            .then((families) => setFamilies(families))
            .catch((error) => console.log(error));
        }
      }, [pathSuffix]);

      const handlePlacement = () => {
        setSelectedFamily(selectedFamily);
        setShowModal(true);
      };
    
      const handleModalClose = () => {
        setShowModal(false);
      };

  return (
        <Container fluid>
            
            <h1>
                {strings.registered_families[language]}
            </h1>

            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell align="right">{strings.first_name[language]}</TableCell>
                    <TableCell align="right">{strings.last_name[language]}</TableCell>
                    <TableCell align="right">{strings.city[language]}</TableCell>
                    <TableCell align="right">{strings.street[language]}</TableCell>
                    <TableCell align="right">{strings.house_number[language]}</TableCell>
                    <TableCell align="right">{strings.apartment_number[language]}</TableCell>
                    <TableCell align="right">{strings.phone_number[language]}</TableCell>
                    <TableCell align="right">{strings.email[language]}</TableCell>
                    <TableCell align="right">{strings.special_comment[language]}</TableCell>
                    <TableCell align="right">{strings.confirmed[language]}</TableCell>
                    <TableCell align="right">{strings.edit[language]}</TableCell>
                    <TableCell align="right">{strings.assigning[language]}</TableCell>


                    <TableCell ></TableCell>

                </TableRow>
                </TableHead>
                <TableBody>
                {families.map((family) => (
                    <TableRow
                    key={family.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell align="right">{family.first_name}</TableCell>
                    <TableCell align="right">{family.last_name}</TableCell>
                    <TableCell align="right">{family.city}</TableCell>
                    <TableCell align="right">{family.street}</TableCell>
                    <TableCell align="right">{family.house_number}</TableCell>
                    <TableCell align="right">{family.apartment_number}</TableCell>
                    <TableCell align="right">{family.phone_number}</TableCell>
                    <TableCell align="right">{family.email}</TableCell>
                    <TableCell align="right">{family.special_comment}</TableCell>
                    <TableCell align="right">{family.confirmed ?<span>&#10004;</span> : ''}</TableCell>
                    <TableCell align="right">
                        <Button as={Link} to={`${family.id}`} variant="primary" state={{ family ,pathSuffix}} >{strings.edit[language]}</Button>
                        </TableCell>
                        <TableCell align="right">                        
                        <Button  variant="primary" onClick={() => handlePlacement()} >{strings.assigning[language]}</Button>
                        </TableCell>
                        <Assigning show={showModal} onHide={handleModalClose} language={language} family={null}/> 

                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
    </Container>

    );
}
