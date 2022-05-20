import { Fab, Card, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppSelector } from "../app/hooks";
import { userSelector, userWishlistSelector } from "../features/UserSlice";
import MarketplacePostPreviewList from "./MarketplacePostPreviewList";

export default function WishlistPage(){
    let items = useAppSelector(userWishlistSelector)
    let user = useAppSelector(userSelector)

    const wishlistItems = () =>{
        if(items.length === 0)
            return <div><Typography>You don't have any items on wishlist yet!</Typography></div>
        else return(
            <MarketplacePostPreviewList posts={items} user={user}/>
        )
    }

    let navigate = useNavigate(); 
    const handleGoHome = () =>{ 
      navigate("/home")
    }

    return (
        <div style={{textAlign:"center",borderRadius:"50px",width:"fit-content",margin:"auto",marginTop:"150px"}}>
             <div style={{textAlign:"center",marginBottom:"20px"}}>
                <Fab onClick={handleGoHome} style={{backgroundColor:"#ff3333"}}>
                    <ArrowBackIcon/>
                </Fab>
            </div>
            <Card style={{display: "inline-grid",maxWidth:"1600px",minWidth:500,border:"1px solid", }}>
                {wishlistItems()}
            </Card>
            
        </div>
    )
}