import { Button, CardContent, Card, Typography, Fab, Grid } from "@mui/material";
import { useNavigate} from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import ChatIcon from '@mui/icons-material/Chat';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SellIcon from '@mui/icons-material/Sell';
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, userSelector } from "../features/UserSlice";
import { LoggedUserDetails } from "../features/types";
import logo from "../assets/logo_cropped.png"
import background_image from "../assets/background.png"
export default function HomePage() {

  const dispatch = useAppDispatch();
  const userLogged: LoggedUserDetails = useAppSelector(userSelector);
 
  let navigate = useNavigate(); 
  const handleLogout = () =>{ 
    dispatch<any>(logout());
    navigate("/")
  }

  return (
    <div style={{width:"-webkit-fill-available",height:"100vh"}}>
    <img style={{width:"-webkit-fill-available",height:"100vh",position:"relative"}} src={background_image}></img>
    <div style={{float:"right", position:"absolute",right:10,top:10}}>
    <Button  variant="contained" color="primary" onClick={handleLogout}>
                    Log out
                </Button>
    </div>
  <div style={{position:"absolute",bottom:"60%",left:"50%",transform:"translate(-50%,50%)"}}> 
    <div style={{textAlign:"center"}}> 
               
           
        <Card style={{display: "inline-grid",marginTop: "150px",border:"2px solid",
        borderRadius: "2.5rem 2.5rem 2.5rem 2.5rem" ,background:'rgba(255, 255, 255, 0.6)'}} variant="outlined">
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs ={4}>
                        <Fab variant="extended" size="large" color="primary" onClick={() =>{navigate('/profile')}}>
                            <PersonIcon />
                            <Typography style={{fontSize:13}}>
                                 Profile
                            </Typography>
                        </Fab>
                    </Grid>
                    <Grid item xs={4}>
                        <Fab variant="extended" size="large" color="primary" onClick={() => {navigate("/wishlist")}}>
                            <FavoriteIcon /> 
                            <Typography style={{fontSize:13}}>
                                Wishlist
                            </Typography>
                        </Fab>
                    </Grid>
                    <Grid item xs={4}>
                        <Fab variant="extended" size="large" color="primary" onClick={() => {navigate("/marketplace")}}>
                            <ShoppingCart /> 
                            <Typography style={{fontSize:13}}>
                            Marketplace
                            </Typography>
                        </Fab>
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{marginTop:"20px"}} justifyContent="space-around">
                    <Grid item xs={4} md={3}>
                        <Fab variant="extended" size="large" color="primary" onClick={() => {navigate("/outfitGenerator")}}>
                            <CheckroomIcon /> 
                            <Typography style={{fontSize:13}}>
                                Looking for an outfit?
                            </Typography>
                        </Fab>
                    </Grid>
                    <Grid item xs={4} md={3}>
                        <Fab variant="extended" size="large" color="primary" onClick={() => {navigate("/chat")}}>
                            <ChatIcon />   
                            <Typography style={{fontSize:13}}>
                                Chat
                            </Typography>
                        </Fab>
                    </Grid>
                    <Grid item xs={4} md={3}>
                        <Fab variant="extended" size="large" color="primary" onClick={() => {navigate("/additem")}}>
                            <SellIcon />
                            <Typography style={{fontSize:13}}>
                                Want to sell something?
                            </Typography>
                        </Fab>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </div></div></div>
  );
}