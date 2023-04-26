import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import strings from '../static/Strings.json';
import { useContext } from 'react';
import { LanguageContext } from '../common/LanguageContext';


function Login() {
  const { language, changeLanguage } = useContext(LanguageContext);
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