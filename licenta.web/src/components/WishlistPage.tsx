import { Fab, Card, Typography, Grid, Dialog } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from "react";
import { Post } from "./types";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { userSelector, userWishlistSelector } from "../features/UserSlice";
import MarketplacePostPreview from "./MarketplacePostPreview";
import PostDetailsDialog from "./PostDetailsDialog";

export default function WishlistPage(){
    const dispatch = useAppDispatch();
    let items = useAppSelector(userWishlistSelector)
    let user = useAppSelector(userSelector)

    console.log(items)
    const wishlistItems = () =>{
        if(items.length === 0)
            return <div><Typography>You don't have any items on wishlist yet!</Typography></div>
        else return(
            <Grid container spacing={1}>
                {items.map((post) =>{
                    return ( <Grid item xs={4}>
                                <MarketplacePostPreview post={post} dialogClose={handleDialogOpen} user={user}/>
                            </Grid> )
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
        <div style={{textAlign:"center",marginTop:"150px"}}>
             <div style={{textAlign:"center",marginBottom:"20px"}}>
             <Fab onClick={handleGoHome} style={{marginLeft:"20px",backgroundColor:"#ff3333"}}>
                <ArrowBackIcon></ArrowBackIcon>
                </Fab>
            </div>
            <Card style={{display: "inline-grid",width:"1500px"}} variant="outlined">
                {wishlistItems()}
            </Card>
            {(() => {
                if (dialogPost !== undefined)
                    return (
                        <div>
                            <Dialog
                                fullWidth  maxWidth="md"  open={dialogOpen}
                                onClose={handleDialogClose}>
                                <PostDetailsDialog item={dialogPost.item} seller={dialogPost.seller} id={dialogPost.id}
                                description={dialogPost.description} cityLocation={dialogPost.cityLocation}></PostDetailsDialog>
                            </Dialog>
                        </div>
                    );
            })()}
        </div>
    )
}