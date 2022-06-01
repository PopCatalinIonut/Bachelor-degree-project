import { Typography } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { userSelector, userWishlistSelector } from "../../features/slices/UserSlice";
import MarketplacePostPreviewList from "../MarketplacePostPreviewList";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

export default function WishlistPage(){
    let items = useAppSelector(userWishlistSelector)
    let user = useAppSelector(userSelector)

    const wishlistItems = () =>{
        if(items.length === 0)
            return <div style={{textAlign:"center",width:450,marginTop:"30%"}}>
                <Typography style={{fontWeight:800,fontSize:25}}>You don't have any items on wishlist yet!</Typography>
                    <ErrorOutlineOutlinedIcon style={{width:300,height:300}}/>
                </div>
        else return( <MarketplacePostPreviewList posts={items} user={user}/> )
    }

    return (<div style={{display: "inline-grid",maxHeight:"700px",minHeight:400,width:"fit-content"}}> 
                {wishlistItems()}
            </div>
    )
}