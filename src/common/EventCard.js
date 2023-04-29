import './common.css';
import { LanguageContext } from './LanguageContext';
import strings from '../static/Strings.json';
import { useContext } from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { storage } from './FirebaseApp';
import { ref, getDownloadURL } from 'firebase/storage';

export default function EventCard(props) {
    const { language } = useContext(LanguageContext);
    // get image from storage
    const [url, setUrl] = useState("");
    const imageRef = ref(storage, props.event.image);
    // const imageRef = ref(storageRef, "image");
    getDownloadURL(imageRef).then((url) => {
        setUrl(url);
    }).catch((error) => {
        console.log(error);
    });

    return (
        <Card className="text-center text-dark" >
            <Card.Img src={url} alt="Card image" />
            <Card.ImgOverlay style={{
                backgroundColor: "rgba(255,255,255,0.3)"
            }}>
                <Card.Title>{props.event.settlement}</Card.Title>
                <Card.Text>
                    {new Date(props.event.date.seconds * 1000).toUTCString()}
                </Card.Text>
                <Button variant="primary">{strings.reg_host[language]}</Button>
            </Card.ImgOverlay>
        </Card>
    )
}