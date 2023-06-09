import './common.css';
import { LanguageContext } from './LanguageContext';
// import React, { useState, useEffect } from 'react';

import { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { useState } from 'react';
import { storage } from './FirebaseApp';
import { ref, getDownloadURL } from 'firebase/storage';
import citys from '../static/city.json';

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

  let city;
  if (language === "he") {
      city = citys.values.find((city) => city.english_name === props.event.settlement).name;
  }
  else {
      city = props.event.settlement;
  }

  return (
    <Card className="text-center text-dark map-card" >
      <Card.Img variant="top" src={url} />
      <Card.Body>
        <Card.Title>{city}</Card.Title>
      </Card.Body>
    </Card>

  )
}