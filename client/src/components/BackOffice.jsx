import dayjs from "dayjs";
import API from "../API";
import './../App.css';


import { Table,Form,  Button, Container, Row, Col, Card, ListGroup, ListGroupItem, Image, Dropdown} from 'react-bootstrap';
import {Badge} from "react-bootstrap";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { PlusCircle, ThreeDots, CaretUpFill, CaretDownFill } from "react-bootstrap-icons";
import { Trash, PencilSquare, BoxArrowRight, ArrowBarUp, XSquare, PlusCircleFill, X, Pencil } from "react-bootstrap-icons";


import MessageContext from "../messageCtx";






function BackPagesList(props) {

    const [privatePages, setPrivatePages] = useState([]);
    const [blockPageId, setBlockPageId] = useState(null);
    const [privateBlocks, setPrivateBlocks] = useState([]);
    const [users, setUsers]  = useState([])

    //for add and edit
    const [title, setTitle] = useState(props.page ? props.page.title : '');
    const [author, setAuthor] = useState(props.page ? props.page.username : '' );
    const [publishDate, setPublishDate] = useState(props.page ? props.page.publishDate: '' );
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [newPage, setNewPage] = useState('');
    const [blockType, setBlockType] = useState('header');



    //for edit
    const [pageToEdit, setPageToEdit] = useState('')
    const [user, setUser] = useState('')
    const [changed, setChanged] = useState(false);
    const [enable, setEnable] = useState(true)
    

    
    const [modeEditBlock, setModeEditBlock] = useState(false)
    const [blockToEdit, setBlockToEdit] = useState('')
    
    
   
 
    const {handleErrors} = useContext(MessageContext);


    //handeling add and edit 
    //if mode = 2 -> add mode
    //if mode = 1 -> edit mode
    //if mode = 0 -> not edit nor add mode
    const [mode, setMode] = useState(0)
    
    //the page to be edited
    const [pageId, setPageId]= useState(null); 

useEffect(()=>{
    
    
    const getUsers = async () => {
        try{
       const gotusers = await  API.getUsers()
            
            setUsers(gotusers)
           
           
                
                
                props.setDirty(true); }
           
        catch (err) {
          //  handleErrors(err)
            props.setDirty(false);
        }
    }

    getUsers();
   

},[]);
        
        
    

    useEffect(() => {
        const settingPages = async () => {
            try {
                const pages = await API.listPrivatePages();
               
                setPrivatePages(pages);
                props.setDirty(false);
              
                
            } catch (err) {
                handleErrors(err)
                props.setDirty(false);
            }
        }
        settingPages();
        
    }, [props.dirty]);
    
    useEffect(() => {
        const settingBlocks = async (pId) => {
            try {
                if (blockPageId != null) {
                    
                    let blocks = await API.listPrivateBlocks(pId);
                    props.setDirty(false);
                    console.log(blocks)
                    setPrivateBlocks(blocks)
                    setPrivateBlocks(blocks.sort((a,b)=> a.rank - b.rank))
                    
                }

            } catch (err) {
                handleErrors(err)
                props.setDirty(false);

            }
        }
        settingBlocks(blockPageId);
}, [blockPageId, mode, props.dirty, changed])



    //handle delete

const checkPriv = (owner) =>{
        if((props.username == owner) ||(props.isAdmin))
        {
            return true
        }
        else
        {
            return false
        }
    }




    
    
    const checkDate = (pubDate)=>{
        let state,color;
        if (dayjs(pubDate).isAfter(dayjs())) { state = 'scheduled'; color = 'warning'}
        else{
            if(!dayjs(pubDate).isValid()) {state = 'draft'; color = 'danger'}
            else{
                state = 'published';
                color = 'success'
            }
        } 
        return {state : state, color: color};
        
    }
    
    const deletePage = (pageId) => {
        API.deletePage(pageId)
        .then(() => { props.setDirty(true); })
        .catch(err => {
            handleErrors(err);
            props.setDirty(true);


         });
       
    }
    
   
    //handle add 
    const addPage = (page, blocks)=>{
      
        API.addPage(page, blocks)
        .then(()=> {props.setDirty(true);})
        .catch(err => {
            props.setDirty(true)
            handleErrors(err)
         })
  
    }

    

   
    
    return (
        <div>   
        { mode == 0 && 
        (
            <>
    <PageList blockToEdit={blockToEdit} setBlockToEdit={setBlockToEdit} modeEditBlock={modeEditBlock} setModeEditBlock={setModeEditBlock} pageToEdit={pageToEdit} setPageToEdit={setPageToEdit} privatePages={privatePages} privateBlocks={privateBlocks} blockPageId={blockPageId} setBlockPageId={setBlockPageId}
    deletePage={deletePage} mode ={mode} setMode={setMode} pageId={pageId} setPageId={setPageId}
    title={title} setTitle={setTitle} newPage={newPage} setNewPage={setNewPage}
    auhtor={author} setAuthor={setAuthor} setPublishDate={setPublishDate} user={props.username} checkPriv={checkPriv} checkDate={checkDate}/>       
    <AddButton setPrivateBlocks={setPrivateBlocks} setMode={setMode} setPageId={setPageId} addPage={addPage} setDirty={props.setDirty} />
    </>
        )
    }
    {
        (mode === 1)   &&
        (
            <>
            <Formpage  blockToEdit={blockToEdit} setBlockToEdit={setBlockToEdit} modeEditBlock={modeEditBlock} setModeEditBlock={setModeEditBlock} 
            setContent={setContent} content={content} users={users} user={user} setUser={setUser} pageToEdit={pageToEdit} setPageToEdit={setPageToEdit} setDirty={props.setDirty} 
            changed={changed} setChanged={setChanged} newPage={newPage} setNewPage={setNewPage} image={image} setImage={setImage}  mode={mode} setMode={setMode} 
            privateBlocks = {privateBlocks} setBlockPageId={setBlockPageId} setPrivateBlocks = {setPrivateBlocks} 
            setPublishDate={setPublishDate} author={author} setAuthor={setAuthor} title={title} setTitle={setTitle}  publishDate={publishDate} isAdmin={props.isAdmin}  blockPageId={props.blockPageId} blockType={blockType} setBlockType={setBlockType}/>
            </>
        )
    }
     {
        (mode === 2)  &&
        (
            <>
            <Formpage modeEditBlock={modeEditBlock} setDirty={props.setDirty} changed={changed} setChanged={setChanged} pageToEdit={pageToEdit} setPageToEdit={setPageToEdit} newPage={newPage} setNewPage={setNewPage} image={image} setImage={setImage}  blockType={blockType} setBlockType={setBlockType} mode={mode} setMode={setMode} setPrivateBlocks={setPrivateBlocks} setPublishDate={setPublishDate}
            blockPageId={props.blockPageId} setBlockPageId={setBlockPageId} privateBlocks={privateBlocks}  
            content={content} setContent={setContent} setAuthor={setAuthor} author={author} title={title} setTitle={setTitle} publishDate={publishDate} addPage={addPage} />
            </>
        )
    }

            
         </div>
)
   

        }





function PageList(props){
    return(
        <>
    {props.privatePages.filter(a=> a.publishDate.isValid()).sort((a, b)=>{ return a.publishDate.isAfter(b.publishDate) ? 1 : -1 }).map(page => (
        <div>
        <PageCard setPrivateBlocks={props.setPrivateBlocks} pageToEdit={props.pageToEdit} setPageToEdit={props.setPageToEdit} key={page.id} newPage={props.newPage} setNewPage={props.setNewPage}  
        page={page} blockpageId={props.blockPageId} setBlockPageId={props.setBlockPageId} blocks={props.privateBlocks}
        deletePage={props.deletePage} mode={props.mode} setMode={props.setMode} pageId={props.pageId} setPageId={props.setPageId}
        title={props.title} setTitle={props.setTitle} auhtor={props.auhtor} setAuthor={props.setAuthor} setPublishDate={props.setPublishDate}
        checkPriv={props.checkPriv} checkDate={props.checkDate} setBlocks={props.setBlocks} setContent={props.setContent}/>
                </div>
                ))
    }
    {props.privatePages.filter(a=>{return !a.publishDate.isValid()}).map(page=>(
        <PageCard setPrivateBlocks={props.setPrivateBlocks} pageToEdit={props.pageToEdit} setPageToEdit={props.setPageToEdit} key={page.id} newPage={props.newPage} 
        setNewPage={props.setNewPage}  page={page} blockpageId={props.blockPageId} setBlockPageId={props.setBlockPageId} blocks={props.privateBlocks}
        deletePage={props.deletePage} mode={props.mode} setMode={props.setMode} pageId={props.pageId} setPageId={props.setPageId}
        title={props.title} setTitle={props.setTitle} auhtor={props.auhtor} setAuthor={props.setAuthor} setPublishDate={props.setPublishDate}
        checkPriv={props.checkPriv} checkDate={props.checkDate} setBlocks={props.setBlocks} setContent={props.setContent}
        ></PageCard>
    ))}
    </>
    )
}


function AddButton(props){
    return(
    <div className="fixed-button-container">
    <PlusCircleFill style={{"fill": "#548CA8", "width": "32px","height": "32px"}}  
    onClick={()=>{
            props.setPrivateBlocks([])
            props.setMode(2)
            props.setPageId(null)}}/>
    </div>
    )

}



function PageCard(props) {
    

    let state = props.checkDate(props.page.publishDate).state
    let color = props.checkDate(props.page.publishDate).color
    

    let isOwner = props.checkPriv(props.page.username)
  
    

    return (
<Container>
    <Row>
        <Col className='sol-sm-4'>
            <Card className='card-style card border-dark mb-3 my-card'
                style={{ margin: "0.2% 0 0 0 " }}
            //key={props.page.id}
            >
        <Card.Body>
            
            <Card.Title>{props.page.title}{' '} </Card.Title>
            <Badge pill bg={color}>{state}</Badge>
            <Card.Text>
                Author : {props.page.username}</Card.Text>
            <Card.Text>
                Publication date : {props.page.publishDate.format("YYYY-MM-DD")}
            </Card.Text>

            {
                (props.blockpageId != props.page.id) ? (
                    <>
            <Button variant="outline-secondary" onClick={() => { props.setBlockPageId(props.page.id) }}><ThreeDots />
            </Button> {' '}
            {isOwner && <Button  variant="outline-secondary" onClick={() => { props.deletePage(props.page.id);  props.setDirty(1) }}><Trash />
            </Button>} {' '}
            {isOwner && <Button  variant="outline-secondary" onClick={() => { 
                props.setMode(1)
                props.setPageToEdit(props.page.id)
                props.setTitle(props.page.title)
                props.setAuthor(props.page.username)
                props.setPublishDate(props.page.publishDate.format("YYYY-MM-DD"))
                //the page 
                props.setBlockPageId(props.page.id)
               

                
                }}><PencilSquare />
            </Button>}
                    </>

                ) :
                    (
                        <>
            <ListGroup variant='flush'>
                {props.blocks.sort((a, b) => a.rank - b.rank)
                    .map((block, i) => {
                        // Return a component for each block value
                        return (
                            <BlocksInfo key={i} block={block} />
                        )
                    }
                    )}

            </ListGroup>

                    <Button className="custom-button" style={{ "marginLeft": "10px" }} variant="outline-secondary" 
                    onClick={() => { 
                        props.setBlockPageId(null)
                        props.setContent(null)
                        }}><ArrowBarUp /></Button>
                        </>
                    )}
        </Card.Body>

            </Card>
        </Col>
    </Row>
</Container>
    )
}



function BlocksInfo(props) {
    return (
        <>
            <ListGroup.Item>
                <Card.Subtitle>
                    {props.block.type}
                </Card.Subtitle>
                {props.block.type != "image" && (<Card.Text>{props.block.content}</Card.Text>)}
                {props.block.type == 'image' && (<Image src={props.block.content} style={{ "width": "100%",
  "height": "100%",
  "objectFit": "contain"}}/>)}
            </ListGroup.Item>

        </>
    )
}

function Formpage(props){
   

const editPageInfo = (pageId, page) =>{

    API.updatePage(pageId, page)
    .then(() => { props.setDirty(true); })
    .catch(err => {
        handleErrors(err)
        props.setDirty(false)
     });
    
   }


    const blocks  = props.privateBlocks;
    return (
        <Form className="block-example border border-secondary rounded mb-0 form-padding" >
        { (props.mode === 1 && props.isAdmin) && 
            <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Select value={props.author} onChange={event => props.setAuthor(event.target.value)} aria-label="Default select example">
      
      {props.users.map((a)=>
       
        <option value={a.username}>{a.username}</option>
      
        
      )}
      
    </Form.Select>
          </Form.Group>
        }
        { <>
        <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="title" value={props.title} onChange={event => props.setTitle(event.target.value) }/>
          </Form.Group> 
        
        <Form.Group className="mb-3">
            <Form.Label>Publish Date</Form.Label>
            <Form.Control type="date" value={props.publishDate} onChange={event => props.setPublishDate(event.target.value) }/>
          </Form.Group>
          </>
        }

        {
            props.mode === 1 && 
            <Form.Group className="mb-3">
            <Button className="mb-3 my-button" 
            onClick={
                ()=>{

                    const page = {
                        username: props.author,
                        title : props.title,
                        publishDate: props.publishDate
                    }

                    editPageInfo(props.pageToEdit, page);
                  
                   
                    
                }
            }
            >Save page information</Button>
            </Form.Group>
        }
          
     
        
        
     {(props.mode === 1 || props.mode === 2) &&  props.privateBlocks.map((block)=>
          
              
            <BlockForms  blockToEdit={props.blockToEdit} setBlockToEdit={props.setBlockToEdit} modeEditBlock={props.modeEditBlock} setModeEditBlock={props.setModeEditBlock} setDirty={props.setDirty} mode={props.mode} setMode={props.setMode} block={block} image={props.image} setImage={props.setImage} privateBlocks={props.privateBlocks} setPrivateBlocks={props.setPrivateBlocks}
            changed={props.changed} setChanged={props.setChanged} setContent={props.setContent}/>
          )
        }

    {(props.modeEditBlock === true ) &&
    <EditContentForm setModeEditBlock={props.setModeEditBlock} setDirty={props.setDirty} setContent={props.setContent} blockToEdit={props.blockToEdit}
    content={props.content} setBlockToEdit={props.setBlockToEdit}
    
    />}

    

    { (props.modeEditBlock === false) &&
    <AddBlockForm mode={props.mode} blockType={props.blockType} setBlockType={props.setBlockType} 
    content={props.content} setContent={props.setContent} setDirty={props.setDirty}
    privateBlocks={props.privateBlocks} setPrivateBlocks={props.setPrivateBlocks}
    image={props.image} setImage={props.setImage} pageToEdit={props.pageToEdit}
    
    />}

    
            
        
    

          
          <Button className="mb-3 my-button my-small-button" variant="outile-secondary" 
          
          onClick={

           
              
              ()=>{
                props.setBlockType('header')
                if(props.mode == '2')
                {const page = {
                    title: props.title,
                    publishDate: props.publishDate
                }
               
               
                props.addPage(page, props.privateBlocks)}
                props.setMode(0)
                props.setAuthor('')
                props.setPublishDate('')
                props.setBlockPageId(null)
                props.setBlockPageId(null)
                props.setPrivateBlocks([])
                props.setTitle('')
                props.setBlockType('header')
            }
           
          }

          >Save</Button>
          &nbsp;
          <Button className="btn btn-danger my-small-button mb-3" onClick={()=>{
            props.setBlockType('header')
            console.log(props.blockType)
            props.setMode(0)
            props.setAuthor('')
            props.setPublishDate('')
            props.setBlockPageId(null)
            props.setPageToEdit(null)
            props.setPrivateBlocks([])
            props.setTitle('')
            props.setContent('')
            props.setBlockType('header')
            
           }}> Cancel </Button>

        </Form>
      )
}

function BlockForms(props){




    //functions for adding
  
 const handleMove = (blockId, direction)=>
    {

        //ranks are ranging from 1 to blocks.length
        //we get rank
        //we want to increment it if down
        //decrement it if up
        
       
        let rank = props.privateBlocks.filter((a)=> a.id == blockId)[0].rank
        
        let newRank
        if(direction == 'up') 
        {newRank= rank - 1}
        else {newRank = rank+1 }
      
        let affectedBlock = props.privateBlocks.filter((a)=> a.rank == newRank)[0]
      
        let affectedId  = affectedBlock.id
       
        let blocks = props.privateBlocks.map((a)=>{
            if(a.id == blockId) {
                a.rank = newRank
              
                return a
            }
            else{
                if(a.id == affectedId){
                    a.rank = rank
                  
                    return a
                }
                else{
                    return a
                }
        }})
       
        

        props.setPrivateBlocks(blocks.sort((a,b)=> a.rank - b.rank))
        

    }

 const handleDelete = (blockId)=>{
   

        let rank = props.privateBlocks.filter((a)=> {
            return a.id == blockId
        })[0].rank
      
        let blocks = props.privateBlocks
        blocks = blocks.map((a)=>{
            if(a.rank > rank )
            {
                let newRank = a.rank - 1
                a.rank = newRank
                return a
            }
            else{
                return a
            }
        })
         blocks = props.privateBlocks.filter((a) => 
            {return a.id != blockId}
        )
       

        props.setPrivateBlocks(blocks)

    }

    //functions for editing
    
const handleDeleteEdit = (pageId, blockId) =>{
    API.deleteBlock(pageId, blockId)
    .then(() => { props.setDirty(true); })
    .catch(err => {
        handleError(err)
        props.setDirty(true)

      
     });
    

}

    
const handleMoveEdit = (pageId, blockId,up) =>{
    API.moveBlock(pageId, blockId, up)
    .then(() => { 
        props.setPrivateBlocks(props.privateBlocks.sort((a,b)=> a.rank - b.rank))
        props.setDirty(true); })
    .catch(err => {
        props.setDirty(true)
        handleError(err)

      
     });
    

}









    console.log(props.mode)

    return (<>
        {props.block.type != 'image' &&
        <Form.Group className="mb-3">
        <X onClick={()=> {props.mode === 1 ? handleDeleteEdit(props.block.pageId, props.block.id) : handleDelete(props.block.id)}}/>
        {props.block.rank != 0 && <CaretUpFill  
 onClick={()=>{
            
    if(props.mode === 1) 
    {handleMoveEdit(props.block.pageId, props.block.id, 'true')}
    else{handleMove(props.block.id, 'up')}
    
    }}/>}
    {props.block.rank != (props.privateBlocks.length - 1 ) && <CaretDownFill 
onClick={()=>{{
    if(props.mode === 1) 
    {handleMoveEdit(props.block.pageId, props.block.id, 'false' )}
    else{ handleMove(props.block.id, 'down')}
    }
    
    }}/>}<Form.Label>{props.block.type}</Form.Label>
        {props.mode == '1'  &&  <Pencil
        onClick={()=>{
            props.setModeEditBlock(true)
            props.setBlockToEdit(props.block)
            props.setContent('')
                
           }}/> }
          
        <Form.Control type="content" value={props.block.content} onChange={event => props.set(event.target.value)}/>
      </Form.Group>
}
{props.block.type == 'image' &&
        <Form.Group className="mb-3"> <X onClick={()=> {props.mode === 1 ? handleDeleteEdit(props.block.pageId, props.block.id) : handleDelete(props.block.id)}}/>
               {props.block.rank != 0 && <CaretUpFill 
        onClick={()=>{
            if(props.mode === 1) 
            {handleMoveEdit(props.block.pageId, props.block.id, 'true')}
            else{handleMove(props.block.id, 'up')}
            
        }}/>}{props.block.rank != (props.privateBlocks.length - 1 ) && <CaretDownFill 
        onClick={()=>{{
            if(props.mode === 1) 
            {handleMoveEdit(props.block.pageId, props.block.id, 'false' )}
            else {handleMove(props.block.id, 'down')}
            
            }}}/>}<Form.Label>{props.block.type}</Form.Label>
        {props.mode == '1' && <Pencil
         onClick={()=>{
            props.setModeEditBlock(true)
            props.setBlockToEdit(props.block)
            props.setContent('')
                
           }}/> }
        
        <Image src={props.block.content} style={{ "width": "100%",
  "height": "100%",
  "object-fit": "contain"}}/>
  </Form.Group>
}
</>
    )
}

function AddBlockForm(props){
    let newImage = '../../images/python.jpg'
    const handleAddEdit = (pageId, block)=>{
        API.addBlock(pageId, block)
        .then(()=>{
            props.setDirty(true);
        })
        .catch(err => {
            handleError(err)
            setDirty(true)
        });
    }
    
    

    
    return(
    <Form.Group className="mb-3">
    <Form.Label>Choose Type</Form.Label>
    <Form>
      {['radio'].map((type) => (
        <div key={`inline-${type}`} className="mb-3">
          <Form.Check
          defaultChecked={true}
            inline
            label="Header"
            name="group1"
            type={type}
            id={`inline-${type}-1`}
            onChange={()=>props.setBlockType('header')}
          />
          <Form.Check
            inline
            label="Paragraph"
            name="group1"
            type={type}
            id={`inline-${type}-2`}
            onChange={()=>props.setBlockType('paragraph')}
          />
          <Form.Check
            inline
            label="Image"
            name="group1"
            type={type}
            id={`inline-${type}-3`}
            onChange={()=>props.setBlockType('image')}
          />
        </div>
      ))}
      {props.blockType != 'image' && 
      <ContentForm mode={props.mode} pageToEdit={props.pageToEdit} handleAddEdit={handleAddEdit} blockType = {props.blockType} content={props.content} setContent={props.setContent} privateBlocks={props.privateBlocks}
      setPrivateBlocks={props.setPrivateBlocks}/>}
      {props.blockType == 'image' && 
      <>
      <Form.Group>

    <Form.Select value={newImage} onChange={event => newImage =event.target.value} aria-label="Default select example">
      
    
        <option value={'../../images/python.jpg'}>Python</option>
        <option value={'../../images/js.jpg'}>JavaScript</option>
        <option value={'../../images/java.jpg'}>Java</option>
        <option value={'../../images/rust.jpg'}>Rust</option>
      
        
     
    </Form.Select>



    </Form.Group>
   
    <Form.Group style={{ "marginTop": '20px', "display": 'flex', "justifyContent": 'flex-end' }}>
    <Button style={{ "marginRight": '15px' }} className="custom-button  my-button" onClick={()=>{
            props.setImage(newImage)
            
            if(props.mode === 2)
            {   
            let brank = props.privateBlocks.length 
            const block = {
                id: brank,
                type: props.blockType,
                content: newImage,
                rank: brank
            }
            props.setPrivateBlocks(([...props.privateBlocks, block ]))
        }

            
            else{
                const block = {
                    
                    type: props.blockType,
                    content: newImage,
                    rank: props.privateBlocks.length 
                   
                }
                console.log(block)
                handleAddEdit(props.pageToEdit, block)
            }
            
           

         }} >Add</Button>

     </Form.Group>
    
    </>
    }
    </Form>
    
    </Form.Group>

    )

}

function ContentForm(props){
    return(
        <>
        <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control type="content" value={props.content} onChange={event => {
                props.setContent(event.target.value)
               
              
            
            }}/>
            {console.log(props.content)}
          </Form.Group>
          <div style={{ "marginTop": '20px', "display": 'flex', "justifyContent": 'flex-end' }}>
    <Button style={{ "marginRight": '15px' }} className="custom-button  my-button" onClick={()=>{
        if(props.mode == '2')
        {           
                const block = {
                    id:props.privateBlocks.length ,
                    type: props.blockType,
                    content: props.content,
                    rank: props.privateBlocks.length  
    
                } 
            props.setPrivateBlocks(([...props.privateBlocks, block]))
            console.log(props.privateBlocks)
            props.setContent('')
        }
            else{
                const block = {
                    
                    type: props.blockType,
                    content: props.content,
                    rank: props.privateBlocks.length 
                   
                }
                console.log(props.pageToEdit)
                console.log(block)

                props.handleAddEdit(props.pageToEdit, block)
                
                props.setContent('')

            }

         }} >Add</Button>
         </div>
         </>
        
    )
}


function EditContentForm(props){

    const handleEditBlock = (pageId, blockId) =>{
        API.updateBlock(props.content, pageId, blockId)
        .then(()=>{
            props.setDirty(true);
        })
        .catch(err => {
            handleError(err)
            setDirty(true)
        })
}

    let newImage = ''

    return(
        <>
        <Form.Group className="mb-3">
            <Form.Label>{`New Content for Block  ${props.blockToEdit.rank}` }</Form.Label>
            {props.blockToEdit.type != "image" &&
            <Form.Control type="content" value={props.content} onChange={event => {
                props.setContent(event.target.value)
               } }/>
                }
            {props.blockToEdit.type == 'image' &&
           
             <>
             <Form.Group>
                
       
           <Form.Select value={props.content} onChange={event => props.setContent(event.target.value)} aria-label="Default select example">
             
               <option value={'../../images/python.jpg'}>choose an image</option>
               <option value={'../../images/python.jpg'}>Python</option>
               <option value={'../../images/js.jpg'}>JavaScript</option>
               <option value={'../../images/java.jpg'}>Java</option>
               <option value={'../../images/rust.jpg'}>Rust</option>
             
               
            
           </Form.Select>
           </Form.Group>
           </>
           }
           
        
            
        
          </Form.Group>
          <div style={{ "marginTop": '20px', "display": 'flex', "justifyContent": 'flex-end' }}>

    <Button style={{ "marginRight": '15px' }} className="custom-button  my-button" onClick={()=>{
        
        handleEditBlock(props.blockToEdit.pageId, props.blockToEdit.id)
        props.setModeEditBlock(false)
        props.setContent('')
        }}>
        Replace content
    </Button>
    <Button style={{ "marginRight": '15px' }} variant="danger" className="custom-button" onClick={()=>{
         props.setModeEditBlock(false)
         props.setContent('')
        }}>
       Cancel
    </Button>
    </div>
        </>
    )
}



export default BackPagesList;