import './common.css';
import Carousel from 'react-bootstrap/Carousel';
import React, { useState, useEffect } from 'react';
import { storage } from './FirebaseApp';
import { ref, getDownloadURL } from 'firebase/storage';
import {getPic } from './Database';

// async function getPic() {
//     const picRef = collection(db, "carusels");
//     const picSnapshot = await getDocs(picRef);
//     const pic = picSnapshot.docs.map(doc => doc.data());
//     return pic;
// }

export default function SlidePicture(props) {
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        getPic().then(pics => {
            const promises = pics.map((pic) => {
                const imageRef = ref(storage, pic.img);
                return getDownloadURL(imageRef);
            });
            Promise.all(promises)
                .then((urls) => {
                    setUrls(urls);
                })
                .catch((error) => {
                    console.log(error);
                });
        })
    }, []);

    return (
        <Carousel className='carusel'>
            {urls.map((url, i) => {
                return (
                    <Carousel.Item key={i}>
                        <img
                            className="d-block w-100 s-pic"
                            src={url}
                            alt="Slide"
                        />
                    </Carousel.Item>
                )
            }
            )}
        </Carousel>
    )
}