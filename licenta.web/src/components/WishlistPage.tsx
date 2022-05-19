import { Fab, Card, Typography, Grid, Dialog } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from "react";
import { Post } from "./types";
import { useAppSelector } from "../app/hooks";
import { userSelector, userWishlistSelector } from "../features/UserSlice";
import MarketplacePostPreview from "./MarketplacePostPreview";
import PostDetailsDialog from "./PostDetailsDialog";

export default function WishlistPage(){
    let items = useAppSelector(userWishlistSelector)
    let user = useAppSelector(userSelector)

    const wishlistItems = () =>{
        if(items.length === 0)
            return <div><Typography>You don't have any items on wishlist yet!</Typography></div>
        else return(
            <Grid container spacing={1} style={{justifyContent:"center"}}>
                {items.map((post) =>{
                    return ( <div style={{ margin:"20px 15px 15px 10px",display:"flex",flexDirection:"row",}}>
                                <MarketplacePostPreview post={post} dialogOpen={handleDialogOpen} user={user}/>
                            </div> )
                })}
            </Grid>
        )
    }
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogPost, setDialogPost] = useState<Post>();
    const handleDialogOpen = (post: Post) => {
        setDialogPost(post);
        setDialogOpen(true);
    };

    const handleDialogClose = () =>{
        setDialogOpen(false);
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
            {(() => {
                if (dialogPost !== undefined)
                    return (
                        <div>
                            <Dialog
                                fullWidth  maxWidth="md"  open={dialogOpen}
                                onClose={handleDialogClose}>
                                <PostDetailsDialog item={dialogPost.item} seller={dialogPost.seller} 
                                    cityLocation={dialogPost.cityLocation} id={dialogPost.id}
                                    description={dialogPost.description} isActive={dialogPost.isActive}/>
                            </Dialog>
                        </div>
                    );
            })()}
        </div>
    )
}