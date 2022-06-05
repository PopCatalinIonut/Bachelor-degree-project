import { Dialog, Grid } from "@mui/material";
import { useState } from "react";
import MarketplacePostPreview from "./MarketplacePostPreview";
import PostDetailsDialog from "./PostDetailsDialog";
import { Post, PostUserDetails } from "./types";

export interface MarketplacePostPreviewListProps{
    posts: Post[],
    user: PostUserDetails
}

export default function MarketplacePostPreviewList(props: MarketplacePostPreviewListProps){

    const [dialogPost, setDialogPost] = useState(<div></div>);

    const handleDialogOpen = (post:Post) => {
        setDialogPost(
            <div >
                <Dialog  fullWidth={true} maxWidth={false} style={{width:1200,position:"absolute",top:"-4%",left:"12vw",height:"108vh"}} open={true} onClose={handleDialogClose}>
                    <PostDetailsDialog post={post} dialogClose={handleDialogClose}/>
                </Dialog>
            </div>
        );
    };

    const handleDialogClose = () =>{    setDialogPost(<div></div>)   }
    return(
        <Grid container spacing={1} style={{justifyContent:"center"}} >
            {props.posts.map((post) =>{
                return ( <div style={{display:"flex", flexDirection:"row", margin:"20px 10px 15px 10px",justifyContent:"center", width: 350,maxWidth: 350,height:500,padding:0}}>
                            <MarketplacePostPreview post={post} dialogOpen={handleDialogOpen} user={props.user} key={post.id}/>
                            </div>)})}
                            
        {dialogPost}
        </Grid>
        
    )
}