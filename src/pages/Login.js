import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import strings from '../static/Strings.json';
import { useContext } from 'react';
import { LanguageContext } from '../common/LanguageContext';
import { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";


function Login() {
  const firebaseConfig = {
    apiKey: "AIzaSyCBC742Q2W8Z5AM_5GcMEuUZLjhUQxw4aU",
    authDomain: "meirim-b3c4f.firebaseapp.com",
    projectId: "meirim-b3c4f",
    storageBucket: "meirim-b3c4f.appspot.com",
    messagingSenderId: "725325643196",
    appId: "1:725325643196:web:7d38a099023dca9d35bfb9",
    measurementId: "G-YRT0FDPHJC"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();


  const { language } = useContext(LanguageContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Card className="text-center w-50 m-auto mt-5">
    <Card.Body>
      <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>{strings.email[language]}</Form.Label>
        <Form.Control type="email" placeholder={strings.email_placeholder[language]} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>{strings.login_password[language]}</Form.Label>
        <Form.Control type="password" placeholder={strings.login_password[language]} />
      </Form.Group>
      <Button variant="primary" type="submit">
        {strings.login[language]}
      </Button>
    </Form>
    </Card.Body>
  </Card>

  );
}

export default Login;