import { Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid,  TextField, Typography } from '@mui/material'
import React from 'react'
import {   Link , useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup,GoogleAuthProvider , signInWithEmailAndPassword, signOut} from "firebase/auth";

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { app, auth } from '../../firebase/Firebase';


function Login() {
  const navigate = useNavigate(); 
  signOut(auth)
    const handlSubmit = (e)=>{
        e.preventDefault(); 
        const email=e.target.email.value;
        const password = e.target.password.value;
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    navigate('/')
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });


    }

    const provider = new GoogleAuthProvider();

    const singGoogle=()=>{

      signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken; 
      // The signed-in user info.
      const user = result.user;
      console.log(user.displayName)
      navigate('/')
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
    }
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handlSubmit}  noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/login"  >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/sinup"  >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Box >
          <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={singGoogle}
            >
              Sign In With google
            </Button>
          </Box>
        </Box> 
      </Container>
    </div>
  )
}

export default Login
