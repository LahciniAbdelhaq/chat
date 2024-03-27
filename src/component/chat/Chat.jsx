import { AccountCircle } from '@mui/icons-material'
import { AppBar, Avatar, Box, Button, FormControl, Grid, IconButton,  Menu, MenuItem,  TextField, Toolbar, Typography  } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'

import MenuIcon from '@mui/icons-material/Menu';
import { Timestamp, arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { v4 as uuid } from "uuid";


function Chat({activeChat,userinfo}) { 
  const [anchorEl, setAnchorEl] = useState(null);
const [messages,setmessage]=useState([]);
const inpuref=useRef()  ;
const contRef =useRef(); 
const [userName, setUsername] = useState(''); 
const [data ,setdata]=useState('')

const handlsubmit =async(e)=>{
    e.preventDefault();  
    console.log(data)
    await updateDoc(doc(db, "chats", data), {
      messages: arrayUnion({
        id: uuid(),
        text: inpuref.current.value ,
        senderId: userName.uid,
        date: Timestamp.now(),
      }),
    });
    inpuref.current.value=''    
    contRef.current.scrollTop=(  contRef.current.scrollHeight) + 11 ;
    
}
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);  
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

 

  
  useEffect(() => {  
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsername(user); 
      
   
const    Data =user.uid > userinfo.uid
              ? user.uid + userinfo.uid
              : userinfo.uid + user.uid
           
    setdata(Data) 
    const unSub = onSnapshot(doc(db, "chats" ,Data), (doc) => {
      doc.exists() && setmessage(doc.data().messages);
    });

    return () => {
      unSub();
    };
  });
  }, [userinfo]);
  return ( 
      <Grid item xs={9}  sx={{display: 'flex',flexDirection: 'column', width:"100%" ,height:"90vh",background: "linear-gradient(45deg,  #fe6b8b 30%, #ff8e53 90%)"}} > 

      {activeChat && (
      <Box component="section"  width={'100%'} sx={{ position: 'sticky', top:0 }}>
      
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
         { userinfo.displayName}

          </Typography>
          {  (
            <div>
               <Avatar alt="Profile Picture"  src={userinfo.photoURL} onClick={handleMenu}/>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem> 
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
    )}{activeChat && (
    <Box component="section"  sx={{ height: '80vh',width:"100%",display: 'flex' ,flexDirection: 'column' }}> 
    <Box ref={contRef}  sx={{height: '90vh', overflowY: "scroll" , scrollbarWidth: "none"  }}>
    {
        messages.map((item,index)=>{
            return (
              <div key={index} className={`message ${item.senderId === userName.uid && "owner"}`}>
                <div className="messageInfo">
        <img
          src={ 
            item.senderId === userName.uid
              ? userName.photoURL
              : userinfo.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
                 <div className={`messageContent ${item.senderId === userName.uid && "owner"}`}>
                 <p >
                        {item.text}
                        
                </p> 
                 </div>
              </div>
               
            )
        })
    }
    </Box>
    </Box>
    )}{activeChat && (
    <Box component="section"  width={'100%'} sx={{
        position: 'sticky',
        bottom: 0,   // Set your desired background color
        color: 'white', // Set text color
        textAlign: 'center',
        
      }} >  
      <form action="" method="post" onSubmit={handlsubmit}>
      <FormControl sx={{ display: 'flex' ,flexDirection: 'row'  , }}>
      <TextField id="filled-basic" inputRef={inpuref} label="Send Somme message" variant="filled" sx={{ width:'90%'  ,alignSelf: 'flex-end'}}/>
      <Button type='submit'  color='secondary' variant="outlined" sx={{ width:"80px" ,padding:'0 9px',textAlign:"left" }}>envoyer</Button>
      </FormControl>
      </form>
    </Box> 
    )} 
   
    </Grid> 
  )
}

export default Chat
