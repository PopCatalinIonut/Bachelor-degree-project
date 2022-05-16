import { Button, CardContent, Card,FormControl, Input, InputLabel, Typography } from "@material-ui/core";
import { unwrapResult } from "@reduxjs/toolkit";
import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { initUserWishlist, userLogin } from "../features/UserSlice";
import { LoggedUserDetails } from "../features/types";
export default function LoginPage() {
  const dispatch = useAppDispatch();

  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [incorrectCredentials, setIncorrectCredentials] = useState(<div></div>)
  let navigate = useNavigate(); 
  const handleSignup = () =>{ 
    navigate("/signup")
  }

  const handleLogin = async () =>{ 
    const response = await dispatch(userLogin({username:usernameValue,password:passwordValue}))
    try {
      const payload: LoggedUserDetails = unwrapResult(response);
      console.log(payload);
      if(payload.wishlist.length > 0 ){
        dispatch(initUserWishlist(payload.wishlist))
      }
      navigate("/home");
    } catch (err) {
      setIncorrectCredentials(<div style={{marginTop:"20px",marginBottom:"20px"}}><Typography style={{color:"red"}}>Incorrect username or password</Typography></div>);
    }

  }
  return (
    <div style={{textAlign:"center"}}> 
    <Card style={{display: "inline-grid", textAlign:"center",marginTop: "200px" }} variant="outlined">
      <CardContent>
        <div style={{ display: "inline-grid"}}>
          <Typography style={{fontWeight: 600, fontSize:30}}>Welcome!</Typography>
          {incorrectCredentials}
          <FormControl>
              <InputLabel>Username</InputLabel>
              <Input value={usernameValue} onChange={event =>{ setUsernameValue(event.target.value)}}/>
          </FormControl>
          <FormControl>
              <InputLabel >Password</InputLabel>
              <Input type="password" value={passwordValue} onChange={event =>{setPasswordValue(event.target.value)}}/>
          </FormControl>
        </div>
        <div >
          <Button type="button" variant="contained" style={{display: "inline-grid",marginTop:"20px"}}
           color="primary" size="large" onClick={handleLogin}>
              Log in
          </Button>
        </div>
        <Typography style={{marginTop:"20px"}}>Don't have an account?
            <Button type="button" variant="contained" color="primary" style={{ marginLeft:"20px"}}
             onClick={handleSignup}> Sign up</Button>
        </Typography>
      </CardContent>
    </Card> </div>
  );
}