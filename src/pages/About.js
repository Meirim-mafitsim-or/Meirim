
import React from 'react';
import strings from '../static/Strings.json';
import { useContext } from 'react';
import { LanguageContext } from '../common/LanguageContext';
import { getAbout, updateAbout } from '../common/Database';
import { Button, Card } from 'react-bootstrap';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { UserContext } from '../common/UserContext';

export default function About() {
    const { language } = useContext(LanguageContext);
    const [about, setAbout] = React.useState([]);
    const [editing, setEditing] = React.useState(false);
    const { user } = useContext(UserContext);
    React.useEffect(() => {
        getAbout().then(about => setAbout(about));
    }, []);

    return (
        <Card className="text-center w-75 m-auto text-dark mt-5">    
            <Card.Body>
                <Card.Title>
                    {strings.about[language]}
                    {user && user.role==='admin' ? (
                    <IconButton onClick={()=> setEditing(true)}>
                        <EditIcon />
                    </IconButton>
                    ) : null}
                </Card.Title>
                <Card.Text style={{
                    whiteSpace: 'pre-line'
                }}>
                    {editing && user && user.role==='admin' ? (
                        <textarea
                            className="form-control"
                            defaultValue={language === "he" ? about.text_he : about.text_en}
                            rows="15"
                            cols="50"
                            onChange={(e) => {
                                if (language === "he") about.text_he = e.target.value;
                                else about.text_en = e.target.value;
                                setAbout(about);
                            }}
                        />) : (
                            language === "he" ? about.text_he : about.text_en
                    )}
                    {/* {language === "he" ? about.text_he : about.text_en} */}
                </Card.Text>
            </Card.Body>
            {editing  && user && user.role==='admin' &&(
                <Card.Footer>
                    <Button
                        variant="outline-secondary"
                        onClick={() => {
                            setEditing(false);
                            updateAbout(about);
                        }}
                    >
                        <SaveIcon />
                        {strings.save[language]}
                    </Button>
                </Card.Footer>
            )
            }
        </Card>
    )
}
        
//         <div className="App home-paragraph home-color" style={
//             {
//                 color: 'black',
//             }
//         }>
            
            

            
//         </div>
//     )

// }

    
    
        



