import { useState } from "react";
import { Post, PostUserDetails } from "./types";
import { Fab, Paper, Grid, Typography, ButtonBase } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
export interface MarketplacePostPreviewProps {
    post: Post;
    dialogOpen: (post: Post) => void;
    user: PostUserDetails
}

export default function MarketplacePostPreview (props: MarketplacePostPreviewProps){

    var post = props.post;
    const [imageToShow, setImageToShow] = useState({image:post.item.images[0],counter:0});

    const handleImageChangeRight = () =>{
        if(imageToShow.counter + 1 < post.item.images.length)
            setImageToShow({image:post.item.images[imageToShow.counter+1],counter:imageToShow.counter+1})
    }
    const handleImageChangeLeft = () =>{
        if(imageToShow.counter -1 >= 0)
            setImageToShow({image:post.item.images[imageToShow.counter-1],counter:imageToShow.counter-1})
    }

    const handleOpenDialog = () =>{
        props.dialogOpen(post);
    }
    
    return (
        <Paper style={{minHeight:450,maxHeight:500,height:"fit-content"}}>
            <div style={{width:"350px",height:"350px"}}>
                <img style={{width:"350px",height:"350px",position:"relative"}} src={imageToShow.image.link}></img>
                <div style={{position:"relative",top:"-105%",left:"50%",transform:"translate(-50%,50%)",textAlign:"center"}}>
                    <Fab onClick={handleImageChangeLeft} size="medium" style={{width:"10%" , height:"5%"}}>
                        <ArrowBackIcon/>
                    </Fab>
                    <Fab onClick={handleImageChangeRight} size="medium"  style={{width:"10%" , height:"5%"}}>
                        <ArrowForwardIcon/>
                    </Fab>
                </div>
            </div> 
            <div style={{width:"inherit",height:"fit-content"}}>
            <Grid item xs={12} sm container style={{minHeight:"500px",width:"350px"}}>
                    <ButtonBase style={{width:"inherit",height:"25%",alignItems:"normal"}} onClick={handleOpenDialog}>  
                    <Grid item xs container direction="column" >
                            <Grid item xs >
                                <Typography gutterBottom style={{fontWeight:600}} component="div">
                                    {post.item.name}
                                </Typography>
                                <Typography gutterBottom style={{fontWeight:600}} component="div">
                                    {post.item.brand}
                                </Typography>
                                <Typography style={{marginTop:5}} variant="body2" gutterBottom>
                                    {"Size " +post.item.size + " - " + post.item.condition}
                                </Typography>
                            </Grid>
                            <div>
                            <Typography style={{float:"left",marginLeft:5,marginTop:5}}>
                                {"$" + post.item.price}
                            </Typography>
                            <Typography style={{float:"right",alignItems: "flex-end",display: "flex",marginRight:5, marginTop:5}}>
                                <LocationOnIcon style={{width:18}}></LocationOnIcon>{post.location}
                            </Typography>
                            </div>
                        </Grid>
                </ButtonBase>
            </Grid>
            </div>
               
    </Paper>
    )
}