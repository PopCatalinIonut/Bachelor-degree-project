import { Fab, Card, Typography, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppSelector } from "../../app/hooks";
import { userSelector, userWishlistSelector } from "../../features/slices/UserSlice";
import MarketplacePostPreviewList from "../MarketplacePostPreviewList";
import background_image from "../../assets/background.png"
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

export default function WishlistPage(){
    let items = useAppSelector(userWishlistSelector)
    let user = useAppSelector(userSelector)

    const wishlistItems = () =>{
        if(items.length === 0)
            return <div style={{textAlign:"center",width:450}}>
                <Typography style={{fontWeight:800,top:"50%",fontSize:25}}>You don't have any items on wishlist yet!</Typography>
                <ErrorOutlineOutlinedIcon style={{width:300,height:300}}/>
                </div>
        else return(<div style={{width:1150}}>
            <MarketplacePostPreviewList posts={items} user={user}/>

        </div>
        )
    }

    let navigate = useNavigate(); 
    const handleGoHome = () =>{ 
      navigate("/home")
    }

    return (
        <div style={{width:"-webkit-fill-available",height:"100vh"}}>
            <img style={{width:"-webkit-fill-available",height:"100vh",position:"relative"}} src={background_image}></img>
            <div style={{position:"absolute",bottom:"50%",left:"50%",transform:"translate(-50%,50%)"}}> 
                <div style={{textAlign:"center"}}>
                    <Fab onClick={handleGoHome} size="medium" style={{backgroundColor:"#ff3333"}}>
                        <ArrowBackIcon/>
                    </Fab>
                </div>
                <Card style={{display: "inline-grid",maxHeight:"700px",minHeight:400,border:"1px solid",width:"fit-content",
                overflowY:"auto",background:'rgba(255, 255, 255, 0.9)'}}>
                    <CardContent>
                        {wishlistItems()}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}