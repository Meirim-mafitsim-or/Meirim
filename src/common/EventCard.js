import './common.css';
import { LanguageContext } from './LanguageContext';
import strings from '../static/Strings.json';
import { useContext } from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { storage } from './FirebaseApp';
import { ref, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';

export default function EventCard(props) {
    const { language } = useContext(LanguageContext);
    // get image from storage
    const [url, setUrl] = useState("");
    const imageRef = ref(storage, props.event.image);
    getDownloadURL(imageRef).then((url) => {
        setUrl(url);
    }).catch((error) => {
        console.log(error);
    });
    return (
        <Card className="text-center text-dark event-card">
            <Card.Img src={url} alt="Card image" className='h-100' />
            <Card.ImgOverlay className='event-card-overlay'>
                <Card.Title>{props.event.settlement}</Card.Title>
                <Card.Text>
                    {new Date(props.event.date.seconds * 1000).toUTCString()}
                </Card.Text>
                <Button as={Link} to={`Event/${props.event.id}`} variant="primary" >{strings.reg_host[language]}</Button>
            </Card.ImgOverlay>
        </Card>
    )
}