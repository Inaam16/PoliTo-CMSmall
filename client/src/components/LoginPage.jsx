import React, { useState } from 'react';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import './../App.css'


const LoginPage = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    
    const location = useLocation();
    const navigate = useNavigate();
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = {username: email, password: password};
      if(credentials.username == '' || credentials.password == '')
      {
        setErrorMessage('Insert email and password');
        setShow(true);

      }
      else{
      props.login(credentials).then(()=>{
        
        navigate("/home");
        props.setLoggedIn(true);
    }).catch((err)=>{
        setErrorMessage(err.error);
        setShow(true);
      })
    }

    };
  
    return (
                     
      
      <Row className="d-flex vh-100 justify-content-md-center">
       <Col md={4} >
        
          <h2 className="text-center pb-3">Login</h2>
          <Form >
          <div className="alert-container">
            <Alert className=" justify-content-center align-items-center " 
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger">
            {errorMessage}
          </Alert>
          </div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
               
              
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              
              />
            </Form.Group>
            <Button  onClick={handleSubmit}  className="w-100 mt-3 my-button">
              Login
            </Button>
          </Form>
          </Col>
         </Row>
             
  
     
    );
  };
  
function LogoutButton(props) {
 
    return (
      <Button className='my-button my-small-button'  onClick={()=>{props.logout()
        props.setIsLoginPage(false)}}>Logout</Button>
    )
  }
  
  function LoginButton(props) {
    const navigate = useNavigate();
   
    return (
      <Button className='my-button my-small-button' onClick={()=> {navigate('/login')
      props.setIsLoginPage(true)}}>Login</Button>
    )
  }
  
  export { LoginPage, LogoutButton, LoginButton };