import './common.css';
import Carousel from 'react-bootstrap/Carousel';

export default function SlidePicture(props) {
    return (
    <Carousel>
        {props.pics.map((pic, index) => {
            return (
                <Carousel.Item key={index}>
                    <img
                        className="d-block w-100 s-pic" 
                        src={pic}
                        alt="First slide"
                    />
                    {/* <Carousel.Caption>
                        <p>תמונה עם כבוד הנשיא</p>
                    </Carousel.Caption> */}
                </Carousel.Item>
            )
        }
        )}
    </Carousel>
    
    )
}