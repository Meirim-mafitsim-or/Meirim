import './common.css';
import { LanguageContext } from './LanguageContext';
// import React, { useState, useEffect } from 'react';

import { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { useState } from 'react';
import { storage } from './FirebaseApp';
import { ref, getDownloadURL } from 'firebase/storage';

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
    <Card className="text-center text-dark map-card" >
      <Card.Img variant="top" src={url} />
      <Card.Body>
        <Card.Title>{(language === "he") ? props.event.settlement_he : props.event.settlement_en}</Card.Title>
      </Card.Body>
    </Card>

  )
}