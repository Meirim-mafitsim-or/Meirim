import React, { useState, useEffect } from 'react';
import citys from '../static/city.json';
import { db } from './FirebaseApp';
import { collection, getDocs } from "firebase/firestore";
import { Map, Marker, Overlay } from "pigeon-maps"
import MapCard from './MapCard';

async function getEvents() {
  const EventsRef = collection(db, "events");
  const EventsSnapshot = await getDocs(EventsRef);
  const Events = EventsSnapshot.docs.map(doc => doc.data());
  return Events;
}

export default function MyMap(props) {
  const [center, setCenter] = useState([30.8516, 36.0461])
  const [zoom, setZoom] = useState(7)
  const [markers, setMarkers] = useState([])
  const [show, setShow] = useState(false);

  useEffect(() => {
    getEvents().then(Events => {
      const sett = Events.map(event => event.settlement);
      const mark = [];

      for (let i = 0; i < sett.length; i++) {
        let settlements = citys.values.filter(city => city.english_name === sett[i]);
        console.log(settlements);
        if (sett[i] === settlements[0].english_name) {
          mark.push({ name: settlements[0].english_name, latlng: [settlements[0].latt, settlements[0].long], event: Events[i] })
        }
      }
      setMarkers(mark);
    });
  }, []);

  return (
    <Map
      height={500}
      center={center}
      zoom={zoom}
      onBoundsChanged={({ center, zoom }) => {
        setCenter(center)
        setZoom(zoom)
      }}
    >

      {markers.map((marker, index) => (
        //on click show event card
        <Marker
          key={index}
          width={30}
          color="red"
          anchor={[marker.latlng[0], marker.latlng[1]]}
          onClick={() => { setShow(marker); }}
        />
      ))}
      {markers.filter(marker => marker.name === show.name).map((marker, index) => (
        <Overlay key={index} anchor={[marker.latlng[0], marker.latlng[1]]} offset={[120, 79]}>
          {/* when press stop to present event card */}
          <div onClick={() => { setShow(false); }}>
            <MapCard event={marker.event} />
            X
          </div>
        </Overlay>
      ))}
    </Map>
  )
}