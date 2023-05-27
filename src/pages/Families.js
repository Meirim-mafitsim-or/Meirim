import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col,  } from 'react-bootstrap';
import { LanguageContext } from '../common/LanguageContext';
import { db } from '../common/FirebaseApp';
import { collection, doc, setDoc, query, where , getDoc} from "firebase/firestore"; 
import { useLocation } from 'react-router-dom';
import strings from '../static/Strings.json';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


export async function getFamilies(id) {
    console.log(id);
    const events = collection(db, 'events');
    const cur_event = doc(events, id);
    const EventsSnapshot = await getDoc(cur_event);
    const eventData = EventsSnapshot.data();
    return eventData.families || [];;
  }


export default function Families() {
    const { language } = React.useContext(LanguageContext);
    const [families, setFamilies] = useState([]);
    const location = useLocation();
    const [pathSuffix, setPathSuffix] = useState('');

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

  return (
        <Container fluid>
            
            <h1>
                {strings.registered_families[language]}
            </h1>

            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell align="right">{strings.family_name[language]}</TableCell>
                    <TableCell align="right">{strings.address[language]}</TableCell>
                    <TableCell align="right">{strings.phone_number[language]}</TableCell>
                    <TableCell align="right">{strings.email[language]}</TableCell>
                    <TableCell align="right">{strings.confirmed[language]}</TableCell>

                </TableRow>
                </TableHead>
                <TableBody>
                {families.map((family) => (
                    <TableRow
                    key={family.familyName}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell align="right">{family.familyName}</TableCell>
                    <TableCell align="right">{family.address}</TableCell>
                    <TableCell align="right">{family.phoneNumber}</TableCell>
                    <TableCell align="right">{family.email}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
{/* 

            <table>
            <thead>
                <tr>
                    <th>{strings.family_name[language]}</th>
                    <th>{strings.address[language]}</th>
                    <th>{strings.phone_number[language]}</th>
                    <th>{strings.email[language]}</th>
                </tr>
            </thead>
            <tbody>
                {families.map((family, index) => (
                <tr key={index}>
                <td>{family.familyName}</td>
                <td>{family.address}</td>
                <td>{family.phoneNumber}</td>
                <td>{family.email}</td>
                </tr>
                ))}
            </tbody>
        </table>


 */}
        </Container>
    );
}
