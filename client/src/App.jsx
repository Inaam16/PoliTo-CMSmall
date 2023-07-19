import { Button, Col, Container, Row, Toast } from 'react-bootstrap';
import { React, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';


import API from './API';


import 'bootstrap/dist/css/bootstrap.min.css';
//import { getUsers } from '../../server/dao_users';
import { LoginPage} from './components/LoginPage';
import Navigation from './components/Navigation';
import PagesList from './components/FrontOffice';
import BackPagesList from './components/BackOffice';

import MessageContext from './messageCtx';


//login function


function App() {
  
  const [webName, setWebName] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('');
  //check if user is admin -- used for webAppName
  const [isAdmin, setIsAdmin] = useState(false);
  const [dirty, setDirty] = useState(0);

  //get published pages for front office
  
 
  




  const handleErrors = (err) => {
    let msg = '';
    if (err.error) msg = err.error;
    else if (String(err) === "string") msg = String(err);
    else msg = "Unknown Error";
    setMessage(msg); // WARN: a more complex application requires a queue of messages. In this example only last error is shown.
  }
  




  useEffect(()=>{
    const init_wbname = async () => {
    try{
      const wName  = await API.webName();
      setWebName(wName);
    }catch(err)
    {
      setWebName(null);

    }
  };
  init_wbname();
}, []);

useEffect(()=>{
  const  init = async () =>{
    try{
      const user = await API.stillLoggedIn();
      setUser(user);
      setLoggedIn(true);
      if(user.role == "admin"){
        setIsAdmin(true)
      }

      
    }catch(err){
 //   handleErrors(err);
    setUser(null);
    setLoggedIn(false);
    setIsAdmin(false)
    }
  };
  init();
}, []);




  
  const handleLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
       setUser(user);
      // setLoggedIn(true);
      if(user.role == "admin"){
        setIsAdmin(true);
      }
      else{
        setIsAdmin(false);
      }
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };
  const handleLogout = async () => {
    
    await API.logOut();
    
    setLoggedIn(false);
    setIsAdmin(false);
    // clean up everything
    // setUser(null);
    // setFilms([]);
  };

  return (
  <BrowserRouter>
   <MessageContext.Provider value={{ handleErrors }}>
  <Container fluid className='below-nav App'>
  <Navigation isLoginPage={isLoginPage} setIsLoginPage={setIsLoginPage} logout={handleLogout} loggedIn={loggedIn} setWebName={setWebName} webName={webName} isAdmin={isAdmin}/>
    <Routes>
      <Route path='/' element={<PagesList     setIsLoginPage={setIsLoginPage} />}/>
      <Route path='/login' element = {<LoginPage login={handleLogin} setLoggedIn={setLoggedIn} isLoginPage={isLoginPage} setIsLoginPage={setIsLoginPage}  />}></Route>
      <Route path='/home' element = {loggedIn ? (<BackPagesList username={user.username} isAdmin={isAdmin} dirty={dirty} setDirty={setDirty} />):  <Navigate replace to='/'/>}></Route>
     
    </Routes>

    <Toast show={message !== ''} onClose={() => setMessage('')} delay={4000} autohide bg="danger">
       <Toast.Body>{message}</Toast.Body>
    </Toast>
  </Container>
  </MessageContext.Provider>
  </BrowserRouter>
  );

}


export default App
