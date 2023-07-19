'use strict';
//ADD BRACKETS IN INDEX.JS AND PROPS.SETDIRTY IN BACKOFFICE
const PORT = 3000;



const dao_users = require('./dao_users');
const dao_pages = require('./dao_pages');


//imports
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dayjs = require('dayjs');

const app = express();
app.use(morgan('combined'));
app.use(express.json());






/* --- AUTHENTICATION --- */

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
  };


//passport imports
const passport = require('passport');                             
const LocalStrategy = require('passport-local'); 

//method used by passport to find the user 
passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await dao_users.getUser(username, password)
    if(!user)
      return callback(null, false, 'Incorrect username or password');  
      
      return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
  }));
  
// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { 
    callback(null, user);
  });
  
//from the data in the session extract the user info
passport.deserializeUser(function (user, callback) { 
       return callback(null, user); 
  });
  

 //creation of a session
const session = require('express-session');

  
app.use(session({
    secret: "I_politoTorino2023_Helwe",
    resave: false,
    saveUninitialized: false,
  }));

app.use(passport.authenticate('session'));
app.use(cors(corsOptions));



/** --- authentication middleware --- **/

const isLoggedIn = (req, res, next) => {
 // console.log(req);
    if(req.isAuthenticated()) {
      
      
      return next();
    }
     return res.status(401).json({error: 'Not authorized'});
  }


/* --- middleware to check if the user is authorized (admin / authoried user) --- */  

  const checkAuth = async (req, res, next) => {
    
    const currentDate = dayjs()
    const page = await dao_pages.getPage(req.params.pageid)
   
   try{ if(req.user.role === 'admin') {
     
    return next()
    }
    
    if(req.user.username === page.username) {
    
      return next()
    }
     return res.status(401).json({ error: 'Not authorized' }).send()
  }
  catch(error)
  {
    console.log(error)
     return res.status(500).json({error: error}).send()
  
  }
  }
  









// // This function is used to format express-validator errors as strings
// const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
//     return `${location}[${param}]: ${msg}`;
//   };
    
/* --- APIs for managing log in  and log out --- */


/* -- API to perform log in -- */

app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => { 
      
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
            return res.status(401).json({ error: info});
        }
        // success, perform the login and extablish a login session
        req.login(user, (err) => {
          if (err)
            return next(err);
          
          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser() in LocalStratecy Verify Fn
           return res.status(200).json(req.user);
        });
    })(req, res, next);
  });


/* -- check whether the user is logged in or not -- */

app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
       return res.status(200).json(req.user);}
    else
       return res.status(401).json({error: 'Not authenticated'});
  });
  

 /* -- logout the user -- */

  app.delete('/api/sessions/current',  (req, res) => {
    req.logout(() => {
      return res.status(200).json({});
    });
  });
  
app.get('/api/users', isLoggedIn, async (req, res)=>{
 try{ 
  if(req.user.role == 'admin'){
    
  const rows = await dao_users.getUsers();
 
  if(rows.error)
   return res.status(400).json({error: 'error'})
  else{
    res.json(rows);
  }
}
else{
  return res.status(400).json({error: 'Unauthorized user'})
}
}catch(error)
{
  return res.status(500).end();
}

})


/* --- FUNCTIONAL APIs --- */

/* HANDLE WEBSITE NAME */

/* everyone -- get the website name -- */

app.get('/api/websitename', async(req, res)=>{
  try{
  const name = await dao_pages.getWebName();
  if (name.error)
      return res.status(404).json(result);
    else
      // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
      res.json(name);
  }catch(error)
  {
      return res.status(500).end();
  }
})

/* admin only -- set the website name -- */

app.post('/api/websitename', isLoggedIn ,  async(req, res)=>{
   
  try {
    if(req.user.role === 'Regular'){
      return res.status(400).json({error: 'this function is only possible for admin'})
    }
    const newName = req.body.name;
        const result = await dao_pages.setWebName(newName); // NOTE: createFilm returns the new created object
         return res.status(200).json(JSON.parse(result))
      } catch (err) {
        return res.status(503).json({ error: `error during the name changing: ${err}` }); 
      }
    
})

/* HANDLE PAGES */


/* everyone -- get all published pages -- */

app.get('/api/pages/all', async(req, res)=>{
  try{
    const result = await dao_pages.getAllPublishedPages();
    if(result.error){
      return res.status(400).json({error : err})
    }
    else{
      return res.status(200).json(result)
      
    }
  }catch(err)
  {
    return res.status(500).json({error: err})
  }
})


/* authenticated user -- get users's private pages -- */

app.get('/api/pages/mypages', isLoggedIn, async(req, res)=>{
  try{
    const username = req.user.username
    //console.log(req.user);
    const result = await dao_pages.getAllCreatedPages();
    
    if(result.error){
      return res.status(400).json({error: err})
    }
    else{
      return res.status(200).json(result)
    }
  }catch(err)
  {
    return res.status(500).json({error: err})
  }
})


/* authenticated user -- add a new page -- */

app.post('/api/mypages', isLoggedIn, async (req, res) => {
try {
    const pageInfo = req.body.page
    const blockList = req.body.blocks                                       
    let headerFound  = false
    let otherTypeFound = false
    let emptyTextFound  = false
    for(let block of blockList){
      if(block.type === 'header'){
        headerFound = true;
      }
      if(block.type != 'header'){
        otherTypeFound = true;
      }
      if(block.content == ''){
        emptyTextFound = true;
      }
    }
    pageInfo.title = req.body.page.title;      
    if(headerFound && otherTypeFound && pageInfo.title != '' && pageInfo.title !=null ){
      if(emptyTextFound){
        return res.status(400).json({error: 'An empty paragraph or header is not allowed'})
      }
    pageInfo.creationDate = dayjs().format('YYYY-MM-DD');                   
    pageInfo.publishDate = (req.body.page.publishDate || '');
    pageInfo.username =  req.user.username;              
       
    
    
    const username = req.user.username;
    const pageId = await dao_pages.addPage(pageInfo)
    
    let result;
   
    for (let block of blockList) {
        result =   await dao_pages.addBlock(username, pageId, block)
        if (result !== null)
            return res.status(500).json({ error: result })
    }
    return res.status(200).json({ message: 'new page is added' })
}
else{
  return res.status(400).json({error: 'At least one header with a paragraph or image is required '})
}
}
catch (err) {
  console.log(err)
    return res.status(500).json({ error: err });
}
})


/* admin and authenticated user -- delete a page -- */

app.delete('/api/pages/:pageid', isLoggedIn, checkAuth, async (req, res) => {
  try{

  let result = await dao_pages.deleteBlocksByPageId(req.params.pageid)
  if(result.error)
      return res.status(400).json({error: result})

  result = await dao_pages.deletePage(req.params.pageid)
  if(result.error)
      return res.status(400).json({error : result})
  else
      res.json(result)
  }catch(err){
    return res.status(500).json({error: err})
  }
})


/* admin and authorized user -- edit a page -- */

app.put('/api/pages/:pageid', isLoggedIn, checkAuth, async (req, res) => {
 console.log(req.body)
  try 
  {
    if(req.user.role === 'Regular')
    {
    req.body.username = req.user.username;
    }
    const result = await dao_pages.editPage(req.body, req.params.pageid)
    if(result.error)
        return res.status(400).json({error: result})
    else
        return res.status(200).json(result)
      }catch(err){
          return res.status(500).json({error: err})
        }

})


/* HANDLE BLOCKS */

/* -- get all blocks -- */

app.get('/api/pages/:pageId/blocks', async(req, res)=>{

  let result = await dao_pages.getAllBlocks(req.params.pageId);
  if(result.error) return res.status(400).json({error: result});
  else res.json(result);
})


/* -- get private blocks -- */

app.get('/api/mypages/:pageid/blocks', isLoggedIn, async(req, res)=>{

  let result = await dao_pages.getPrivateBlocks(req.params.pageid);
  if(result.error) return res.status(400).json({error: result});
  else res.json(result);

})


/* admin and authenticated user -- edit a block -- */

app.put('/api/pages/:pageid/:blockid', isLoggedIn, checkAuth, async (req, res) => {
  if(req.body.content == "")  return res.status(400).json({ error: 'empty content' });
      else{
  let result = await dao_pages.editBlock(req.body.content, req.params.blockid)
  if(result.error)
      return res.status(400).json({error :result})
  else
      res.json(result)
      }
})


/* authenticated user -- add a block -- */


app.post('/api/mypages/:pageid', isLoggedIn, checkAuth, async (req, res) => {
  try {

      
         
      console.log(req.body)   
      if(req.body.content == "")  return res.status(400).json({ error: 'empty content' });
      else{
        console.log(req.body)

      const result = await dao_pages.addBlock(req.user.username, req.params.pageid, req.body.block)
      if (result !== null)
           return res.status(500).json({ error: err })
      else
      {
       return res.status(200).json( {message: 'done'} )
      }
    }
  }
  catch(err) {
       return res.status(500).json({ error: err })
  }
})






/* admin and authenticated user -- delete a block -- */

app.delete('/api/mypages/:pageid/:blockid', isLoggedIn, checkAuth, async (req, res) => {
  try {
    const result = await dao_pages.deleteBlock(req.params.blockid)
    if (result === null)
    return res.status(200).json({ message: 'block deleted' })
    else{
      console.log(err)
    return res.status(500).json({ error: result })
    }
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ error: err })
  }
})

/* admin and authenticated user -- move a block -- */

app.put('/api/pages/:pageid/:blockid/move', isLoggedIn, checkAuth, async (req, res) => {

  try{
  let result = await dao_pages.moveBlock(req.params.pageid, req.params.blockid, req.body.up)
  if(result.error)
      {return res.status(400).json({error: result})}
  else
      {res.json.status(200)({message: result})}
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({error: err })
  }
})





// app.get('/api/:pageId', async(req, res)=>{
//     try{
//         const userId = await dao_pages.getUserId(req.params.pageId);
//         res.json(userId);

//     }catch(err){
//         res.json(err);
//     }
    
// })


app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });