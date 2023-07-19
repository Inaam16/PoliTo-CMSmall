
//we have a data base consisting of three table
//users (username, email, password, role, salt)
//pages (id, username, title, creationDate, publishDate)
//blocks (id, username, pageId, type, content, rank)



'use strict';
const { Page, Block } = require('./pb');


const db = require('./db');
const dayjs = require('dayjs');
/* Website Name Handeling */

/* -- Get the website name -- */

exports.getWebName = () => {
 

  return new Promise((resolve, reject) => {
    const sql = 'SELECT * from webName'
   db.get(sql, [],(err, row)=>{
    if (err) { reject(err); }
      else {
        resolve(row.webName)

   }
    });
  })

}

/* admin only -- set website name -- */

exports.setWebName = (newWebName) => {
 

  return new Promise((resolve, reject) => {
   const sql= ' UPDATE webName SET webName = ?  WHERE id = 1'
   db.run(sql, [newWebName], (err)=>{
    if(err) reject(err);
    else{
      resolve('web name')
    }
   })
    })

}

/* Pages Handeling */

/* unauthorized users -- get published pages -- */


exports.getAllPublishedPages = () => {
  return new Promise((resolve, rejetct) => {
    //get all pages 
    const sql = 'SELECT * FROM pages'
    //check the date and filter the ones that are not published
    db.all(sql, [], (err, rows) => {
      if (err) { rejetct(err); }
      else {
        rows = rows.filter(row => {

          let rowDate = String(row.publishDate);
          let pubDate;
          let formatPubDate;
          if (rowDate === undefined) return false;
          else {
           

            pubDate = dayjs(rowDate).format('YYYY-MM-DD');
            const currentDate = dayjs().format('YYYY-MM-DD');
            return dayjs(dayjs(currentDate)).isAfter(dayjs(pubDate))

          }
        })
        resolve(rows)
      }
    })
  })
}

/* authorized user -- get private pages -- */

exports.getAllCreatedPages = () => {
  return new Promise((resolve, reject) => {

    //console.log(username)
    const sql = 'SELECT * FROM pages'
    db.all(sql,  (err, rows) => {
      if (err) { reject(err); }
      else {
        resolve(rows);
      }
    })
  })
}

/* authenticated user -- add page --*/

exports.addPage = (page) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO pages(title, creationDate, publishDate, username) VALUES (?, ?, ?, ?)'
    db.run(sql, [page.title, page.creationDate, page.publishDate, page.username], err => {
      if (err)
        reject(err)
      const id = 'SELECT last_insert_rowid() AS id';
      db.get(id, (err, row) => {
        if (err)
          reject(err)
        const insertedId = row.id
        resolve(insertedId)
      })
    })
  }
  )
}


/* -- get a page -- */

exports.getPage = (pageId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM pages WHERE id = ?';
    db.get(sql, [pageId], (err, page) => {
      if (err) { reject(err); }
      else
        resolve(page)
    })
  })
}

/* -- edit a page */

exports.editPage = (page, pageid) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE pages SET title = ?, publishDate = ?, username = ? WHERE id = ?'
    db.run(sql, [page.title, dayjs(page.publishDate).format('YYYY-MM-DD'), page.username, pageid], (err) => {
      if (err)
        reject(err)

      resolve('done')
    })
  })
}

/* admin and authorized user -- delete a page -- */


exports.deletePage = (pageId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE  FROM pages WHERE id = ?'
    db.run(sql, [pageId], (err) => {
      if (err)
        reject(err)
      resolve('done')
    })
  })
}


/* Blocks Handeling */

/* -- get all blocks related to a page -- */

// exports.getAllBlocks = (pageId) => {
//   return new Promise((resolve, reject) => {
//     const sql = 'SELECT * FROM blocks WHERE pageId = ?'
//     db.all(sql, [pageId], (err, rows) => {
//       if (err) {
//         reject(err)
//       }
//       else {
//         resolve(rows)
//       }
//     })
//   })
// }

/* unauthenticated -- get all blocks  -- */

exports.getAllBlocks = (pageid) => {
  return new Promise((resolve, reject) => {
    const sqlcheckdate = "SELECT publishDate from pages WHERE id = ?"
    db.get(sqlcheckdate, [pageid], (err, pubDate) => {
      if (err) reject(err);
      else {

        const currentDate = dayjs();
        let check_public = currentDate.isAfter(dayjs(pubDate.publishDate));

        if (check_public) {
          const sqlGetBlocks = "SELECT id, username, pageId, type, content, rank FROM blocks WHERE pageId = ?"
          db.all(sqlGetBlocks, [pageid], (err, rows) => {
            
            if (err) reject(err);
            else {
              resolve(rows)
            }
        })
        }
        
        else{
          resolve([]);
        }

      }
    })
  }
  )
}


    /* authenticated user -- get private blocks --  */

exports.getPrivateBlocks = (pageId) => {
      return new Promise((resolve, reject) => {
        const sql1 = "SELECT id,username, pageId, type, content, rank FROM blocks WHERE pageId = ?"
        db.all(sql1, [pageId], (err, blocks) =>{
         // console.log(blocks)
          if(err) {reject(err);}
          else{
            resolve(blocks);
          }
        }) 
      } 
    )}



    /* authenticated user -- add blocks -- */

    exports.addBlock = (username, pageId, block) => {
      console.log(block)
      return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO blocks(username, pageId, type, content, rank) VALUES (?, ?, ?, ?, ?)'
        db.run(sql, [username, pageId, block.type, block.content, block.rank], err => {
          if (err)
            reject(err)
          else{
          resolve(null)
          }
        })

      })
    }

    /* admin and authenticated user -- edit a block --  */

    exports.editBlock = (content, blockId) => {
      return new Promise((resolve, reject) => {
        const sql = 'UPDATE blocks SET content = ? WHERE id = ?'
        db.run(sql, [content, blockId], (err) => {
          if (err)
            reject({error: err})
          else{
          resolve('Block is edited')
          }
        })

      })
    }

    /* admin and authenticated user -- delete a block -- */

    
    //rearrange the rank
    exports.deleteBlock = (blockId) => {
      return new Promise((resolve, reject) => {

        const sqlCheckType = 'SELECT type, pageId FROM blocks WHERE id = ?';
        db.get(sqlCheckType, [blockId], (err, { type, pageId }) => {
          if (err)
            reject({error: err});
          else{
          if (type == "header") {
            const sqlLastheader = 'SELECT COUNT(*) AS count from blocks WHERE pageId = ? AND type = "header"  '
            db.get(sqlLastheader, [pageId], (err, countHeader) => {
              if (err) { console.log(err); reject(err) }
              else{

                if (countHeader.count == 1) {
                  resolve('Block is the last header and can not be deleted')

                }
                else{
                  const sqlUpdate = 'UPDATE blocks SET rank = rank-1 WHERE rank > (SELECT rank FROM blocks WHERE id = ?) AND pageId = (SELECT pageId FROM blocks WHERE id = ?)'
                  db.run(sqlUpdate, [blockId, blockId], (err) => {
                    if (err)
                      reject(err)
                    else{
                    const sqlDelete = 'DELETE FROM blocks WHERE id = ? ';
                    db.run(sqlDelete, [blockId], (err) => {
                      if (err)
                      {console.log(err)
                        reject(err);
                      }
                      else{
                      resolve(null);
                      }
                    });
                  }
                })

                }
              }
            })
          }
          else {
            const sqlLastBlock = 'SELECT COUNT(*) AS count from blocks WHERE pageId = ? AND type <> "header"  '
            db.get(sqlLastBlock, [pageId], (err, countType) => {
              if (err) { console.log(err); reject(err) }
              else{
                
                if (countType.count == 1) {
                  resolve('Page should have at least one paragraph or image')

                }
                else{
                  const sqlUpdate = 'UPDATE blocks SET rank = rank-1 WHERE rank > (SELECT rank FROM blocks WHERE id = ?) AND pageId = (SELECT pageId FROM blocks WHERE id = ?)'
                  db.run(sqlUpdate, [blockId, blockId], (err) => {
                    if (err)
                      reject(err)
                    else{
                    const sqlDelete = 'DELETE FROM blocks WHERE id = ? ';
                    db.run(sqlDelete, [blockId], (err) => {
                      if (err)
                      {console.log(err)
                        reject(err);
                      }
                      else{
                      resolve(null);
                      }
                    });
                  }
                })

                }
              }
            })

           
          }
        }
      })
      })
    }


    /* admin or authenticated user -- delete a page by username -- */

    exports.deleteBlocksByPageId = (pageId) => {
      return new Promise((resolve, reject) => {
        const sql = 'DELETE  FROM blocks WHERE pageId = ?'
        db.run(sql, [pageId], (err) => {
          if (err)
            reject(err)
          else{
          resolve('deleted all block having the given pageId')
        }})
      })
    }

    /* amin or authenticated user -- move a block up or down -- */

    exports.moveBlock = (pageId, blockId, up) => {

      return new Promise((resolve, reject) => {
       
        let oldrank
        let newrank
        if (up === "true") {
          const sql1 = 'SELECT rank FROM blocks WHERE id = ? AND pageId = ? '
          db.get(sql1, [blockId, pageId], (err, rank) => {
          
            if (err) reject(err)
            else{
            if(rank.rank == 0) resolve('block cannot be moved')
            else{
            const sql2 = 'UPDATE blocks SET rank =  ? WHERE rank = ? AND pageId = ?'
            oldrank = rank.rank
            newrank = oldrank - 1
            db.run(sql2, [oldrank, newrank, pageId], (err) => {
            
              if (err) reject(err)
              else{
              const sql3 = 'UPDATE blocks SET rank =  ? WHERE id = ? AND pageId = ?'
              db.run(sql3, [newrank, blockId, pageId], (err) => {
                if (err) reject(err)
                else{
                resolve('block is moved')
                }
              })
            }
          })
          }
        }
          })
        
        }
      
        else {
         
            const sqlmax = 'SELECT MAX(rank) FROM blocks WHERE pageId = ?'
            db.get(sqlmax, [pageId], (err, max) => {
            
            if (err) reject(err)
          else{

          const sql1 = 'SELECT rank FROM blocks WHERE id = ? AND pageId = ?'
          db.get(sql1, [blockId, pageId], (err, rank) => {
            
            if (err) reject(err)
            else{
            if(rank.rank == max.rank) resolve('cannot push down')
            
            else{
            const sql2 = 'UPDATE blocks SET rank =  ? WHERE rank = ? AND pageId = ?'
            oldrank = rank.rank
            newrank = oldrank + 1
            db.run(sql2, [oldrank, newrank, pageId], (err) => {
              console.log(blockId)
              if (err) reject(err)
              else{
              const sql3 = 'UPDATE blocks SET rank =  ? WHERE id = ? AND pageId = ?'
              db.run(sql3, [newrank, blockId, pageId], (err) => {
                if (err) reject(err)
                else{
                resolve('block is moved')
                }
              

              })
            }
          }
            )
          }
        
        }
          })
        }
          }
          )}
    }
  )
}
  
