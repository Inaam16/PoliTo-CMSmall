import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form, Container, Button,InputGroup, FormControl } from 'react-bootstrap';
//import { Link } from 'react-router-dom';
import { LoginButton, LogoutButton } from './LoginPage';
import API from './../API';
import App from './../App';
import { useNavigate } from 'react-router-dom';




const Navigation = (props) =>{

 
    const handleSubmit = (event) => {
        event.preventDefault();
      }

    
    const handleNameChange =  async ()=>{
  
      try{
      await API.updateWebName(props.webName)
     } catch(error)
     {
      console.log(error)
     }

    }
    
    const navigate  = useNavigate();
   
   



    return(
        <>
    <Navbar className="my-navbar"  fixed='top' expand='sm' style={{"background-color": "#BAD7E9"}} >
        <Container>
          <Navbar.Brand>
{!props.isAdmin ? (
  <div className='my-div '>
  <svg  xmlns="http://www.w3.org/2000/svg" width="30" height="30"  fill="currentColor" className="bi bi-book navbar-icon" viewBox="0 0 16 16">
  <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
</svg> <span> {props.webName} </span></div>):
          (<InputGroup className="mx-2">
          <FormControl onChange={event => props.setWebName(event.target.value)}
            placeholder={props.webName}
            aria-label="webName"
            aria-describedby="basic-addon2"
           // isValid={true}
          />
          
            <Button className="my-button" variant="outline-secondary" onClick={handleNameChange}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
</svg>
            </Button>
         
        </InputGroup>) }
          
          </Navbar.Brand>
        <Container>
        
          <Nav className="me-auto">
            <Nav.Link onClick= {()=> {navigate('/')
          props.setIsLoginPage(false)
          }}>FrontOffice</Nav.Link>
           {props.loggedIn && <Nav.Link onClick={()=> navigate('/home')}>BackOffice</Nav.Link>}
          </Nav>
        </Container>
        <Form className="mx-2">
          {props.loggedIn ? <LogoutButton logout={props.logout} setIsLoginPage={props.setIsLoginPage} /> :  props.isLoginPage == false && <LoginButton  setIsLoginPage={props.setIsLoginPage}/>}
        </Form>
        </Container>


      </Navbar>
    </>
    )

}
export default Navigation