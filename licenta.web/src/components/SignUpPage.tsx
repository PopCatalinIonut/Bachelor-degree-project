import { Button, Card, CardContent, FormControl, Input, InputLabel, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
export default function SignUpPage() {
  
  let navigate = useNavigate(); 
  const handleClick = () =>{ 
    navigate("/")
  }
  return (
    <div style={{textAlign:"center"}}>
    <Card style={{display: "inline-grid", marginTop: "200px" }} variant="outlined">
      <CardContent style={{ textAlign: "center",display: "inline-grid"}}>
        <Typography style={{fontWeight: 600, fontSize:15}}>Please fill this form to create your account!</Typography>
        <div style={{ textAlign: "center",display: "inline-grid",marginLeft:"70px",marginRight:'70px'}}>
          <FormControl>
              <InputLabel>First name</InputLabel>
              <Input/>
          </FormControl>
          <FormControl>
              <InputLabel>Last name</InputLabel>
              <Input />
          </FormControl>
          <FormControl>
              <InputLabel >Email</InputLabel>
              <Input />
          </FormControl>
          <FormControl>
              <InputLabel>Login username</InputLabel>
              <Input />
          </FormControl>
          <FormControl>
              <InputLabel>Password</InputLabel>
              <Input type="password" />
          </FormControl>
        </div>
        <div style={{ display:"grid",marginTop:"20px",marginLeft:"120px",marginRight:"120px"}}>
          <Button type="button" color="primary"  variant="contained" 
            onClick={handleClick}> Create account
          </Button>
          <Button type="button" color="secondary"  variant="contained" style={{marginTop:"10px"}}
            onClick={handleClick}> Go back
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}