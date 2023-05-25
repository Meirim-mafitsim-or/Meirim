import './common.css';
import { Card } from 'react-bootstrap';
import { useState } from 'react';
import { storage } from './FirebaseApp';
import { ref, getDownloadURL } from 'firebase/storage';

export default function EventCard(props) {
  const [url, setUrl] = useState("");
  const imageRef = ref(storage, props.event.image);
  getDownloadURL(imageRef).then((url) => {
    setUrl(url);
  }).catch((error) => {
    console.log(error);
  });

  return (
    <Card className="text-center text-dark event-card" >
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