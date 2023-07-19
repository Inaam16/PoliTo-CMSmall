
import  {Page}  from "./pb";


import dayjs from "dayjs";

const APIURL = 'http://localhost:3000';



/* --- UTILITY FUNCTION --- */

/* -- parse the HTTP response -- */

function getJson(httpResponsePromise) {
    // server API always return JSON, in case of error the format is the following { error: <message> } 
    return new Promise((resolve, reject) => {
      httpResponsePromise
        .then((response) => {
          if (response.ok) {
  
           // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
           response.json()
              .then( json => resolve(json) )
              .catch( err => reject({ error: "Cannot parse server response" }))
  
          } else {
            // analyzing the cause of error
            response.json()
              .then(obj => 
                reject(obj)
                ) // error msg in the response body
              .catch(err => reject({ error: "Cannot parse server response" })) // something else
          }
        })
        .catch(err => 
          reject({ error: "Cannot communicate"  })
        ) // connection error
    });
  }


  /* -- HANDLE WEB NAME */
  
  
  const updateWebName = async (webName) => {
  
    return getJson( fetch(APIURL + '/api/websitename', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            name: webName
        })}).then( json => {
            return json
        })
    )}

const webName = async () => {
    return getJson( fetch(APIURL + '/api/websitename', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',   
    })).then( json => {
        return json
    })
}



/* -- HANDLE USERS -- */

/* -- log in -- */

const login = async (credentials) => {
  return getJson(fetch(APIURL + '/api/sessions', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
  })).then( (json) => {
      return json
  })
}

/* -- still logged in --  */

const stillLoggedIn = async () => {
  return getJson( fetch(APIURL + '/api/sessions/current', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include'  
  }))
  .then( json => {
      return json
  })
}


/* logged in user -- log out -- */
const logOut = async() => {
  return getJson(fetch(APIURL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
  })
  )
}


/* admin -- get all users --  */

const getUsers = async() => {

  return getJson( fetch(APIURL + '/api/users', {
      
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include'  
  })).then(json =>{
    console.log(json)
    return json.map((user)=>{
      const obj ={
        username : user.username
      }
      return obj;
    })
  
  
  })
  
}


/* -- HANDLE PAGES -- */

/* unauthorized user -- list all published pages -- */

const listPublicPages = async () => {
  return getJson(fetch(APIURL + '/api/pages/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
  })).then(json => {
      return json
      .map((page) => {
          const obj = 
          {
            id: page.id, 
            title: page.title, 
            creationDate: dayjs(page.creationDate), 
            publishDate:dayjs(page.publishDate), 
            username: page.username
          }
          return obj
      })
  })
}


/*logged  in user -- list all created pages -- */

const listPrivatePages = async () => {
  return getJson(fetch(APIURL + '/api/pages/mypages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
  })).then(json => {
      return json
      .map((page) => {
          const obj = 
          {
            id: page.id, 
            title: page.title, 
            creationDate: dayjs(page.creationDate), 
            publishDate:dayjs(page.publishDate), 
            username: page.username
          }
          return obj
      })
  })
}

/* logged in user -- add a page -- */

const addPage = async (page, blocks) => {
  
  return getJson( fetch(APIURL + '/api/mypages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
          page: page,
          blocks: blocks
      })
  })).then( json => {
      return json
  })
}

/* admin o authorized user -- edit a page -- */

const updatePage = async (pageid, page) => {
  return getJson( fetch(APIURL + `/api/pages/${pageid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(page)

  })).then( json => {
    return json})
}

/* admin o authorized user -- delete a page -- */

const deletePage = async (pageid) => {
  return getJson( fetch(APIURL + `/api/pages/${pageid}`, {
      method: "DELETE",
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include'
  })).then( json => {
      return json
  })
}


/* -- HANDLE BLOCKS -- */

/* logged in user -- add a block -- */
const addBlock = async (pageid, block) => {
  return getJson( fetch(APIURL + `/api/mypages/${pageid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
          block: block
      })
  })).then( json => {
      return json
  })
}


/* unauhthorized user -- list piblished pages' blocks  -- */

const listPublicBlocks = async (pageId) => {
    // film.watchDate could be null or a string in the format YYYY-MM-DD
    
    return getJson( 
        fetch(APIURL + `/api/pages/${pageId}/blocks`, 
        { credentials: 'include' })
        
    ).then( json => {
      return json.map((block) => {
        const Block  = {
          id: block.id,
          username: block.username,
          type: block.type,
          pageId: block.pageId,
          content: block.content,
          rank: block.rank
        }
        return Block;
      });
    })
  }
  
  /* logged in user -- list of created blocks -- */

const listPrivateBlocks = async(pageId)=>{
    return getJson(
        fetch(APIURL + `/api/mypages/${pageId}/blocks`,
         {credentials: 'include'})
    ).then(json => {
      return json.map(block => {
        const Block  = {
              id: block.id,
              username: block.username,
              type: block.type,
              pageId: block.pageId,
              content: block.content,
              rank: block.rank

      }
    
      return Block;
     } );
    })
  }

/* authorized user o admin -- delete a block -- */

const deleteBlock = async (pageId, blockId) => {
  return getJson(
    fetch(APIURL + `/api/mypages/${pageId}/${blockId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    )
}

/* authorized user o admin -- edit a block -- */

const updateBlock = async (content, pageId, blockId) => {
  return getJson(
    fetch(APIURL + `/api/pages/${pageId}/${blockId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({content: content})
    },
    )
    
    
  )}


  /* authorized user o admin -- move a block -- */


const moveBlock = async (pageId, blockId, up)=>{
  console.log(pageId)
  console.log(blockId)
  console.log(up)
  return getJson(
    fetch(APIURL + `/api/pages/${pageId}/${blockId}/move`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({up: up})
    })
  )
}


const API = 
{
  login, stillLoggedIn, logOut, getUsers,
  updateWebName, webName, 
  listPublicPages, listPrivatePages, addPage, updatePage, deletePage, 
  addBlock, listPrivateBlocks, listPublicBlocks, deleteBlock , updateBlock, moveBlock
}

export default API

