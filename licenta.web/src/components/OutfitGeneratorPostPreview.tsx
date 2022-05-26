import { useState } from "react";
import { Post, PostUserDetails } from "./types";
import { Fab, Paper, Grid, Typography, ButtonBase } from "@material-ui/core";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useAppDispatch } from "../app/hooks";
import { removeItemFromGenerator } from "../features/OutfitSlice";
export interface MarketplacePostPreviewProps {
    post: Post;
    dialogOpen: (post: Post) => void;
    user: PostUserDetails;
    isDeletable: boolean;
}

export default function OutfitGeneratorPostPreview (props: MarketplacePostPreviewProps){

    var post = props.post;
    
    const dispatch = useAppDispatch();
    const [imageToShow, setImageToShow] = useState({image:post.item.images[0],counter:0});

    const handleImageChangeRight = () =>{
        if(imageToShow.counter + 1 < post.item.images.length)
            setImageToShow({image:post.item.images[imageToShow.counter+1],counter:imageToShow.counter+1})
    }
    const handleImageChangeLeft = () =>{
        if(imageToShow.counter -1 >= 0)
            setImageToShow({image:post.item.images[imageToShow.counter-1],counter:imageToShow.counter-1})
    }

    const hanleRemoveFromGenerator = () =>{
        dispatch(removeItemFromGenerator(props.post.id))
    }

    const handleOpenDialog = () =>{
        props.dialogOpen(post);
    }
    return (
        <Paper style={{width: "inherit",height:"100%"}}>
            <Grid container style={{width: "inherit",height:"100%" }}>
                <Grid item xs={6} style={{ backgroundImage:"url(" + imageToShow.image.link + ")",
                    backgroundSize:"cover", backgroundPosition:"center"}}>
                    <Fab onClick={handleImageChangeLeft} style={{width:"15%" , height:"5%"}}>
                         <ArrowBackIcon/>
                    </Fab>
                    <Fab onClick={handleImageChangeRight} style={{width:"15%" , height:"5%"}}>
                         <ArrowForwardIcon/>
                    </Fab>
                   
                </Grid> <div style={{position:"relative",left:-40}}>
                    {(() =>  {
                             if(props.isDeletable === true)
                             return  <Fab onClick={hanleRemoveFromGenerator} style={{width:"150%" , height:"5%", background:"red"}}>
                             <DeleteOutlineOutlinedIcon/>
                         </Fab>}
                     )()}
                  
                    </div>
                <Grid item xs={6} sm container style={{position:"relative"}}>
                    <ButtonBase style={{width:"inherit",display:"inline-block"}} onClick={handleOpenDialog}>   
                        <Grid item xs container direction="column" >
                            <Grid item xs={12} style={{textAlign:"center",justifyContent:"center"}}>
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
                        
                        </Grid> 
                            <div style={{position:"absolute",bottom:0, width:"inherit"}}>
                                <Typography style={{float:"left",marginLeft:5,marginTop:5}}>
                                    {"$" + post.item.price}
                                </Typography>
                                <Typography style={{float:"right",alignItems: "flex-end",display: "flex",right:5}}>
                                    <LocationOnIcon style={{width:18}}></LocationOnIcon>{post.cityLocation}
                                </Typography>
                            </div>
                    </ButtonBase>
                </Grid>
            </Grid>
        </Paper>
    );
}