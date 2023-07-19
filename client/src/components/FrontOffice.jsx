import 'dayjs';
import API from '../API';
import './../App.css'

import {ThreeDots, ArrowBarUp, CardImage} from 'react-bootstrap-icons'
import {Table, Form, Button, Container, Row, Col, Card, ListGroup, ListGroupItem, Image} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import MessageContext from '../messageCtx';
import dayjs from 'dayjs';




function PagesList()
{
    const [publicBlocks, setPublicBlocks] = useState([]);
    const [publicPages, setPublicPages] = useState([]);
    const [blockpageId, setBlockPageId] = useState(null);

    const {handleErrors} = useContext(MessageContext);

    useEffect(()=>{
      const settingPages = async() =>{
          try{
              const pages  = await API.listPublicPages();
            
              setPublicPages(pages);
              props.setIsLoginPage('false')
             
            
              
          }catch(err)
          {   
          }
      }
      settingPages();
  
  }, []);

useEffect( ()=>{
    const settingBlocks = async () =>{
        try{
            if(blockpageId != null)
            {
            let blocks = await API.listPublicBlocks(blockpageId);
            setPublicBlocks(blocks);
           
            }

        }catch(err){

        }
    }
    settingBlocks();
    }, [blockpageId])
  

return (
    <div>
        {publicPages.sort((a,b)=>dayjs(b.publishDate) - dayjs(a.publishDate)).map(page=>(
            <PageCard key={page.id} page={page} blockpageId={blockpageId} setBlockPageId={setBlockPageId} blocks={publicBlocks}></PageCard>
        ))}
        
         
    </div>
)
}

//pass a page for each page card
function PageCard(props)
{
   
   
    return(
        <Container>
            <Row>
                <Col className='sol-sm-4'>
                    <Card className='card-style card border-dark mb-3 my-card'
                    style={{margin : "0.2% 0 0 0 "}}
                    //key={props.page.id}
                    >
                    <Card.Body>
                            <Card.Title>{props.page.title}</Card.Title>
                            <Card.Text>
                               Author : {props.page.username}</Card.Text>
                            <Card.Text>
                                Publication date : {props.page.publishDate.format("YYYY-MM-DD")}
                            </Card.Text>
                            
            {
            (props.blockpageId != props.page.id)?(<Button  variant="outline-secondary" onClick={()=>{props.setBlockPageId(props.page.id)}}><ThreeDots/></Button>): 
            (
                <>
                <ListGroup variant='flush'>
                {props.blocks.sort((a, b) => a.rank - b.rank)
                .map((block, i) => {
                        // Return a component for each block value
                        return (
                          <BlocksInfo key={i} block={block}/>
                )
                        }
            )}
          
            </ListGroup>
            <Button className="custom-button" style={{"marginLeft": "10px"}} variant="outline-secondary" onClick={()=>{props.setBlockPageId(null)}}><ArrowBarUp/></Button>
            
            </>
            ) }
                    </Card.Body>

                    </Card>
                </Col>
            </Row>
        </Container>
    )
}




function BlocksInfo(props)
{
   
    return(
        <>
    <ListGroup.Item>
     {/* <Card.Subtitle>
    {props.block.type}
     </Card.Subtitle> */}
     {props.block.type != "image" && (<Card.Text>{props.block.content}</Card.Text>)}
     {props.block.type == 'image' && (<Image src={props.block.content} style={{ "width": "100%",
  "height": "100%",
  "object-fit": "contain"}}/>)}
   
     </ListGroup.Item>
    
       
        </>
    )
}



export default PagesList;