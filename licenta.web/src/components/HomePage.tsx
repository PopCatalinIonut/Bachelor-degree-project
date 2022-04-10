import { Button, CardContent, Card, Typography, Fab, Grid } from "@material-ui/core";
import { useNavigate} from "react-router-dom";
import PersonIcon from '@material-ui/icons/Person';
import ShoppingCart from '@material-ui/icons/ShoppingCart'
import ChatIcon from '@material-ui/icons/Chat';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SellIcon from '@mui/icons-material/Sell';
export default function HomePage() {

  let navigate = useNavigate(); 
  const handleLogout = () =>{ 
    navigate("/")
  }
    const handleProfile = () =>{ 
    navigate("/profile")
  }
  const handleAddItem = () =>{ 
    navigate("/additem")
  }
  const handleWishlist = () =>{
    navigate("/wishlist")
  }
  let user = "user";
  return (
    <div style={{textAlign:"center"}}> 
        <div style={{ textAlign:"center"}}>
            <Typography style={{marginTop:"50px", fontWeight:800, fontSize:30, marginLeft:"100px"}}> 
                Welcome {user} to the streetwear revolution!
                <Button style={{float:"right"}} variant="contained" color="primary" onClick={handleLogout}>
                    Log out
                </Button>
            </Typography>
           
        </div>
       
        <Card style={{display: "inline-grid",marginTop: "150px" }} variant="outlined">
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs ={4}>
                        <Fab variant="extended" size="medium" color="primary" onClick={handleProfile}>
                            <PersonIcon />
                            <Typography style={{fontSize:13}}>
                                 Profile
                            </Typography>
                        </Fab>
                    </Grid>
                    <Grid item xs={4}>
                        <Fab variant="extended" size="medium" color="primary" onClick={handleWishlist}>
                            <FavoriteIcon /> 
                            <Typography style={{fontSize:13}}>
                                Wishlist
                            </Typography>
                        </Fab>
                    </Grid>
                    <Grid item xs={4}>
                        <Fab variant="extended" size="medium" color="primary">
                            <ChatIcon />   
                            <Typography style={{fontSize:13}}>
                                Chat
                            </Typography>
                        </Fab>
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{marginTop:"20px"}} justifyContent="space-around">
                    <Grid item xs={4} md={3}>
                        <Fab variant="extended" size="medium" color="primary">
                            <CheckroomIcon /> 
                            <Typography style={{fontSize:13}}>
                                Looking for an outfit?
                            </Typography>
                        </Fab>
                    </Grid>
                    <Grid item xs={4} md={3}>
                        <Fab variant="extended" size="medium" color="primary">
                            <ShoppingCart /> 
                            <Typography style={{fontSize:13}}>
                            Marketplace
                            </Typography>
                        </Fab>
                    </Grid>
                    <Grid item xs={4} md={3}>
                        <Fab variant="extended" size="medium" color="primary" onClick={handleAddItem}>
                            <SellIcon />
                            <Typography style={{fontSize:13}}>
                                Want to sell something?
                            </Typography>
                        </Fab>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </div>
  );
}