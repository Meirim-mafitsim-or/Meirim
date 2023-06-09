import './common.css';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useState,useContext } from 'react';
import { storage } from './FirebaseApp';
import { ref, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import citys from '../static/city.json';

export default function EventCard(props) {
    // get image from storage
    const [url, setUrl] = useState("");
    const { language } = useContext(LanguageContext);
    const imageRef = ref(storage, props.event.image);
    getDownloadURL(imageRef).then((url) => {
        setUrl(url);
    }).catch((error) => {
        console.log(error);
    });
    

    let city;
    if (language === "he") {
        city = citys.values.find((city) => city.english_name === props.event.settlement).name;
    }
    else {
        city = props.event.settlement;
    }

    return (
        <Card className="text-center text-dark event-card h-100">
            <Card.Img src={url} alt="Card image" className='event-card-image' />
            {/* <Card.ImgOverlay className='event-card-overlay'>
                <Card.Title>{city}</Card.Title>
                <Card.Text>
                    {new Date(props.event.date.seconds * 1000).toUTCString()}
                </Card.Text>
                <Button as={Link} to={`${props.forward}`} variant="primary" >{`${props.buttonText}`}</Button>
            </Card.ImgOverlay> */}
            <Card.Body>
                <Card.Title>{city}</Card.Title>
                <Card.Text>
                    {new Date(props.event.date.seconds * 1000).toUTCString()}
                </Card.Text>
                <Button as={Link} to={`${props.forward}`} variant="primary" >{`${props.buttonText}`}</Button>
            </Card.Body>

        </Card>
    )
}