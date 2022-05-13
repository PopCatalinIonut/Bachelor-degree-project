import { Button, Card, CardContent, FormControl, Snackbar, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { userSignUp } from "../features/UserSlice/UserSlice";

export default function SignUpPage() {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [firstTimePageOpened, setFirstTimePageOpened] = useState(true);

  const [snackOpened,setSnackOpened] = useState(false);
  const [errorAddingArea, setErrorAddingArea] = useState(<div></div>)

  let navigate = useNavigate(); 
  const dispatch = useAppDispatch();

  const handleGoBack = () =>{
    navigate("/");
  }
  const handleSignUp = async () =>{ 

    var errors = verifyInputs();
    setFirstTimePageOpened(false);

    if(errors.length === 0 ){
      const response = await dispatch(userSignUp({username:usernameValue,password:passwordValue,
        firstName:firstNameValue, lastName:lastNameValue, email:emailValue}));
        var message = response.payload as string;
        if(message.length > 0)
          setErrorAddingArea(<div style={{marginTop:"20px",marginBottom:"20px"}}><Typography style={{color:"red"}}>{message}</Typography></div>);
        else{
          setSnackOpened(true);
          setTimeout( () => { navigate("/") },2000)
        }
    }
  }

  const verifyInputs = () =>{
    var errors: String = "";
    if(usernameValue.length === 0 || passwordValue.length === 0 || emailValue.length === 0 || firstNameValue.length === 0 || lastNameValue.length === 0){
        errors+="Empty fields";
    }
    return errors;
  }
  return (
    <div style={{textAlign:"center"}}>
    <Card style={{display: "inline-grid", marginTop: "200px" }} variant="outlined">
      <CardContent style={{ textAlign: "center",display: "inline-grid"}}>
        <Typography style={{fontWeight: 600, fontSize:15}}>Please fill this form to create your account!</Typography>
        {errorAddingArea}
        <div style={{ textAlign: "center",display: "inline-grid",marginLeft:"70px",marginRight:'70px'}}>
          <FormControl>
              <TextField helperText={firstNameValue === "" && firstTimePageOpened === false ? 'Empty field!' : ' '}  label="First name" 
              error ={firstNameValue === "" && firstTimePageOpened === false ? true : false}
              value={firstNameValue} onChange={event =>{ setFirstNameValue(event.target.value)}}/>
          </FormControl>
          <FormControl>
           <TextField label="Last Name" helperText={lastNameValue === "" && firstTimePageOpened === false ? 'Empty field!' : ' '}
              error ={lastNameValue === "" && firstTimePageOpened === false ? true : false}
           value={lastNameValue} onChange={event =>{ setLastNameValue(event.target.value)}}/>
          </FormControl>
          <FormControl>
              <TextField label="Email" 
              value={emailValue}  helperText={emailValue === "" && firstTimePageOpened === false ? 'Empty field!' : ' '}
              error ={emailValue === "" && firstTimePageOpened === false ? true : false}
              onChange={event =>{ setEmailValue(event.target.value)}}/>
          </FormControl>
          <FormControl>
              <TextField  label="Username" 
               helperText={usernameValue === "" && firstTimePageOpened === false ? 'Empty field!' : ' '}
               error ={usernameValue === "" && firstTimePageOpened === false ? true : false}
              value={usernameValue} onChange={event =>{ setUsernameValue(event.target.value)}}/>
          </FormControl>
          <FormControl>
              <TextField
              label="Password" 
              helperText={passwordValue === "" && firstTimePageOpened === false ? 'Empty field!' : ' '}
              error ={passwordValue === "" && firstTimePageOpened === false ? true : false}
              type="password" value={passwordValue} onChange={event =>{ setPasswordValue(event.target.value)}}/>
          </FormControl>
        </div>
        <div style={{ display:"grid",marginTop:"20px",marginLeft:"120px",marginRight:"120px"}}>
          <Button type="button" color="primary"  variant="contained" 
            onClick={handleSignUp}> Create account
          </Button>
          <Button type="button" color="secondary"  variant="contained" style={{marginTop:"10px"}}
            onClick={handleGoBack}> Go back
          </Button>
        </div>
        <Snackbar
          open={snackOpened} autoHideDuration={3000} message="Account created"
          anchorOrigin={{vertical: "top", horizontal: "center"}}/>
      </CardContent>
    </Card>
    </div>
  );
  }