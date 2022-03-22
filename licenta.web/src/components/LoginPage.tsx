import { Button, CardContent, Card,FormControl, Input, InputLabel, Typography } from "@material-ui/core";
import { useNavigate} from "react-router-dom";
export default function LoginPage() {

  let navigate = useNavigate(); 
  const handleClick = () =>{ 
    navigate("/signup")
  }
  return (
    <div style={{textAlign:"center"}}> 
    <Card style={{display: "inline-grid", textAlign:"center",marginTop: "200px" }}>
      <CardContent>
        <div style={{ display: "inline-grid"}}>
          <Typography style={{fontWeight: 600, fontSize:30}}>Welcome!</Typography>
          <FormControl>
              <InputLabel>Username</InputLabel>
              <Input/>
          </FormControl>
          <FormControl>
              <InputLabel >Password</InputLabel>
              <Input type="password" />
          </FormControl>
        </div>
        <div >
          <Button type="button" variant="contained" style={{display: "inline-grid",marginTop:"20px"}} color="primary" size="large">
              Log in
          </Button>
        </div>
        <Typography style={{marginTop:"20px"}}>Don't have an account?
            <Button type="button" variant="contained" color="primary" style={{ marginLeft:"20px"}}
             onClick={handleClick}> Sign up</Button>
        </Typography>
      </CardContent>
    </Card> </div>
  );
}