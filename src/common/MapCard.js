import './common.css';
// import { LanguageContext } from './LanguageContext';
// import strings from '../static/Strings.json';
// import { useContext } from 'react';
import { Card } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { storage } from './FirebaseApp';
import { ref, getDownloadURL } from 'firebase/storage';
// import { Link } from 'react-router-dom';

export default function EventCard(props) {
  // const { lagnguage } = useContext(LanguageContext);
  // get image from storage
  const [url, setUrl] = useState("");
  const imageRef = ref(storage, props.event.image);
  getDownloadURL(imageRef).then((url) => {
    setUrl(url);
  }).catch((error) => {
    console.log(error);
  });

  return (
    <Card className="text-center text-dark map-card" >
      <Card.Img variant="top" src={url} />
      <Card.Body>
        <Card.Title>{props.event.settlement}</Card.Title>
        <Card.Text>
          in {new Date(props.event.date.seconds * 1000).toUTCString()} we had an event in {props.event.settlement}
        </Card.Text>
      </Card.Body>
    </Card>

  )
}