import React, { useState, useEffect } from 'react';
import citys from '../static/city.json';
import { Map, Marker, Overlay } from "pigeon-maps"
import MapCard from './MapCard';
import { getEvents } from './Database';

export default function MyMap() {
  const [center, setCenter] = useState([30.8516, 36.0461])
  const [zoom, setZoom] = useState(7)
  const [markers, setMarkers] = useState([])
  const [show, setShow] = useState(false);

  useEffect(() => {
    getEvents().then(Events => {
      const sett = Events.map(event => event.settlement);
      const mark = [];

      //every one of the card have english name and hebrow name so i can use only english name
      for (let i = 0; i < sett.length; i++) {
        let settlement = citys.values.filter(city => city.english_name === sett[i]);
          mark.push({ name: settlement[0].english_name, latlng: [settlement[0].latt, settlement[0].long], event: Events[i] })
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
      onClick={() => {
        if (show) {
          setShow(false);
        }
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
          </div>
        </Overlay>
      ))}
    </Map>
  )
}