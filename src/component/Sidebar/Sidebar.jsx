import { AppBar, Avatar, Box, CssBaseline, FormControl, Grid, IconButton, InputAdornment, List, ListItemAvatar, ListItemButton, ListItemText,   TextField,   Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react' 
import LogoutIcon from '@mui/icons-material/Logout'; 
import { app, auth, db } from '../../firebase/Firebase';
import { onAuthStateChanged ,signOut} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from "@mui/icons-material/Clear";
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';

function Sidebar({setActiveChat,setInfouser}) {
  const Navigate=useNavigate(); 
  const [chats, setChats] = useState([]);
    const[username,setSearch]=useState('')
    const [userName, setUsername] = useState('');
    const [user, setUser] = useState(null);
    const handlckUser =()=>{
      setActiveChat(true)
    }
    const handlSingOut =()=>{
          signOut(auth).then(()=>
          {
            Navigate('/login')
          }).catch((err)=>{
              console.log(err)
          })
        
    }
 
    
    //   
    const handleSearch =async () =>{
     
      const q = query(
        collection(db, "users"),
        where("displayName", "==", username)
      );
  
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
          console.log(doc.data())
        });
      } catch (err) {
        console.log(true);
      }
    }
      const handleKey =(e)=>{
        e.code === "Enter" && handleSearch();
      }


      const handleSelect = async () => {
        //check whether the group(chats in firestore) exists, if not create
        console.log(user.uid)
        console.log(userName.uid)
        const combinedId =
        userName.uid > user.uid
            ? userName.uid + user.uid
            : user.uid + userName.uid;
        try {
          const res = await getDoc(doc(db, "chats", combinedId));
          if (!res.exists()) {
            console.log("Ok")
            //create a chat in chats collection
            await setDoc(doc(db, "chats", combinedId), { messages: [] });
    
            //create user chats
            await updateDoc(doc(db, "userChats", userName.uid), {
              [combinedId + ".userInfo"]: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
              [combinedId + ".date"]: serverTimestamp(),
            });
    
            await updateDoc(doc(db, "userChats", user.uid), {
              [combinedId + ".userInfo"]: {
                uid: userName.uid,
                displayName: userName.displayName,
                photoURL: userName.photoURL,
              },
              [combinedId + ".date"]: serverTimestamp(),
            });

          } 
        } catch (err) {}
    
        setUser(null);
        setSearch("")
      };

 


       useEffect(()=>{ 
          const unsub = onAuthStateChanged(auth, (user) => {
            setUsername(user); 
          });
          return unsub()
       },[ ]);
       useEffect(() => {
        console.log(userName.uid)
        const getChats = () => {
          const unsub = onSnapshot(doc(db, "userChats", userName.uid), (doc) => {
            setChats(doc.data());
            console.log(doc.data())
          });
    
          return () => {
            unsub();
          };
        };
    
        userName.uid && getChats();
      }, [userName.uid]);
  return ( 
      <Grid item xs={3} height={200} width={600}  sx={{ position:'relative' }}> 
      <Box >
      <AppBar position="static" color="default">
        <Toolbar>
        <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
        <ListItemAvatar>
              <Avatar alt="Profile Picture"  src={userName.photoURL} />
            </ListItemAvatar>
          </Typography>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 2 }}>
           { userName.displayName}
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handlSingOut}
          > 
            <LogoutIcon />
          </IconButton>
            LogOut
        </Toolbar>
      </AppBar>
      </Box>
      <Box >
      <AppBar position="static" color="default">
        <Toolbar>
        <FormControl  >
        <TextField
        onKeyDown={handleKey}
        onChange={(e)=>{setSearch(e.target.value);}}
        value={username}
          size="small"
          variant="outlined" 
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                style={{ display: 'showClearIcon' }}
                
              > 
              </InputAdornment>
            )
          }}
        />
      </FormControl>
        </Toolbar>
      </AppBar>
      </Box>
      <CssBaseline />
      { user && (
        <Box sx={{ position:'absolute' ,zIndex:11,bgcolor: '#E6E1DB' ,width:"100%" }}>
        <ListItemButton   onClick={handleSelect}  sx={{ bgcolor: '#eadcff' }}>
              <ListItemAvatar>
                <Avatar alt="Profile Picture" src={user.photoURL} />
              </ListItemAvatar> 
              <ListItemText primary={user.displayName }   />
            </ListItemButton>
        </Box>
      )
      }
      <List sx={{height: '75vh', overflowY: "scroll" ,  scrollbarWidth: "none",bgcolor: '#b0b8ba' }}>
        {chats && Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat,index) => (
          <ListItemButton  key={index} onClick={()=>{setInfouser(chat[1].userInfo);handlckUser()}} sx={{ bgcolor: '#dbe1e3' ,border :1,borderColor:"grey.500"}}>
            <ListItemAvatar>
              <Avatar alt="Profile Picture" src={chat[1].userInfo.photoURL} />
            </ListItemAvatar>
            <ListItemText primary={chat[1].userInfo.displayName
}   />
          </ListItemButton>
        ))} 
      </List>
      
      
    </Grid> 
  )
}

export default Sidebar
