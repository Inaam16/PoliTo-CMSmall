
useEffect(()=> {
    const getAllusernames = async() =>{
        try{
              
                const users = await API.getUsers();
               
                setUsers(users)


        }catch(err){
console.log(err)
        }
    }
    getAllusernames();
}, [props.isAdmin])