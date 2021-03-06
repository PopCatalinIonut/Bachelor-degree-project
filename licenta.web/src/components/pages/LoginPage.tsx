import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { initUserWishlist, userLogin } from "../../features/slices/UserSlice";
import { LoggedUserDetails } from "../../features/types";
import { Typography, FormControl, Card, Input, InputLabel, Button, CardContent, Grid } from "@mui/material";
import logo from "../../assets/logo_cropped.jpg"

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
    try { 
      const response = await dispatch(userLogin({username:usernameValue,password:passwordValue}))
      var user = response.payload as LoggedUserDetails;

      if(user.wishlist.length > 0 )
        dispatch(initUserWishlist(user.wishlist))
      
      navigate("/home");
    } catch (err) {
      setIncorrectCredentials(<div style={{marginTop:"20px",marginBottom:"20px"}}><Typography style={{color:"red"}}>Incorrect username or password</Typography></div>);
    }

  }
  return (
    <div style={{position:"absolute",bottom:"50%",left:"50%",transform:"translate(-50%,50%)"}}> 
      <Card style={{display: "inline-grid", textAlign:"center",width:"350px",marginTop:"-5%",border:"2px solid"}} variant="outlined">
        <CardContent style={{padding:0}}> 
         <img src={logo} style={{height:180, width:240}} ></img>
          <Grid container>
            <Grid item xs={12}>
              <div style={{ display: "inline-grid"}}>
                <Typography style={{fontWeight: 600, fontSize:30, marginBottom:"5%"}}>Welcome!</Typography>
                {incorrectCredentials}
                <FormControl>
                    <InputLabel>Username</InputLabel>
                    <Input value={usernameValue} onChange={event =>{ setUsernameValue(event.target.value)}}/>
                </FormControl>
                <FormControl style={{marginTop:"5%"}}>
                    <InputLabel >Password</InputLabel>
                    <Input type="password" value={passwordValue} onChange={event =>{setPasswordValue(event.target.value)}}/>
                </FormControl>
            </div>
            </Grid>
            <Grid item xs={12}>
                <Button type="button" variant="contained" style={{display: "inline-grid",marginTop:"20px"}}
                        color="primary" size="large" onClick={handleLogin}> Log in </Button>
              <Typography style={{marginTop:"20px",marginBottom:"2%", fontWeight:600}}>Don't have an account?
                      <Button type="button" variant="contained" color="primary" style={{ marginLeft:"20px"}}
                      onClick={handleSignup}> Sign up </Button>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card> 
    </div>
  );
}