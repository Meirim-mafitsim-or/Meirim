import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import strings from '../static/Strings.json';
import { useContext } from 'react';
import { LanguageContext } from '../common/LanguageContext';
import { useState } from "react";
import {app} from '../common/FirebaseApp';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';



function Login() {
  const { language } = useContext(LanguageContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth(app);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("success");

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
      <Form.Control
        type="email"
        placeholder={strings.email_placeholder[language]}
        value={email} // add value attribute here
        onChange={(e) => setEmail(e.target.value)} // add onChange event handler here
      />
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>{strings.login_password[language]}</Form.Label>
      <Form.Control
        type="password"
        placeholder={strings.login_password[language]}
        value={password} // add value attribute here
        onChange={(e) => setPassword(e.target.value)} // add onChange event handler here
      />
    </Form.Group>
    <Button variant="primary" type="submit" onClick={handleLogin}>
      {strings.login[language]}
    </Button>
  </Form>
    </Card.Body>
  </Card>

  );
}

export default Login;