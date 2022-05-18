import { useState } from "react";
import { Post, PostUserDetails } from "./types";
import { Fab, Paper, Grid, Typography, Button } from "@material-ui/core";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useAppDispatch } from "../app/hooks";
import { DeletePost, UpdatePostActiveStatus } from "../features/MarketplaceSlice";
import { deletePostReducer, updatePostStatus }  from "../features/UserSlice";

export interface ProfilePostPreviewProps {
    post: Post;
    user: PostUserDetails
  }
export default  function ProfilePostItemPreview (props: ProfilePostPreviewProps){

    const dispatch = useAppDispatch();
    const handleUpdatePostStatus =  async (status: boolean) =>{
         const response =  await dispatch(UpdatePostActiveStatus({postId:props.post.id,status:status}))
         if(response.payload === "Ok"){
             dispatch(updatePostStatus({postId:props.post.id,status:status}))
         }
    }

    const handleDeletePost = async () =>{
        const response = await dispatch(DeletePost(props.post.id));
        if(response.payload === "Ok"){
            dispatch(deletePostReducer(props.post.id))
        }
    }
    const showImages = () =>{
        var images = props.post.item.images;
        if(images.length > 3)
            var images = images.slice(0,3) 
            return <div style={{flexDirection:"row",display:"flex"}}>
                        {images.map((image) =>{
                            return <div style={{ width: 128, height: 128 , backgroundImage:"url(" + image.link + ")",
                                        backgroundSize:"cover", backgroundPosition:"center"}}>
                                    </div>
                        })}</div>
    }

    const showButtons = () =>{
        if(props.post.isActive === true)
        return <Button variant="outlined" size="small" style={{marginRight:30}} 
                       onClick={() => {handleUpdatePostStatus(false)}} >Disable post</Button>
                
        else return(<div>
            <Button variant="outlined" size="small" style={{marginRight:30}} 
                    onClick={() => {handleUpdatePostStatus(true)}}>Activate post</Button>
            <Button variant="outlined" size="small" style={{marginRight:30}}
                    onClick={handleDeletePost}>Delete post</Button>
        </div>)
    }

    return (
        <Paper style={{  margin: 'auto', width: 700,maxWidth: 700,padding:0 }} >
            <Grid container spacing={2} style={{padding:0, marginBottom:20}}>
                <Grid item xs={7} >
                    {showImages()}
                </Grid>
                <Grid item xs={5}>
                    <Grid item xs container direction="column">
                            <Grid item xs >
                                <Typography gutterBottom style={{fontWeight:600,marginRight:30}} component="div">
                                    {props.post.item.name}
                                </Typography>
                                <Typography style={{marginRight:30,marginTop:15}}>
                                {"$" + props.post.item.price}
                            </Typography>
                            {showButtons()}
                            </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}