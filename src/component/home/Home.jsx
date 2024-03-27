import { Container, Grid, Stack } from '@mui/material'
import Sidebar from '../Sidebar/Sidebar';
import React, { useState } from 'react'
import Chat from '../chat/Chat';

function Home() {
    const [activeChat,setActiveChat]=useState(false);
    const [userinfo,setInfouser]=useState('');
  return (
    <Grid container width={'100%'}  >
        <Sidebar setActiveChat={setActiveChat} setInfouser={setInfouser}/>
        {
          activeChat&& (<Chat activeChat={activeChat} userinfo={userinfo}/>)
        }
    </Grid>
  )
}

export default Home
